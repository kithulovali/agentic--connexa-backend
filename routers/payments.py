from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from settings import get_db
from schemas.payment_schema import PaymentCreate, PaymentOut
from services import payment_service, order_service
from core.security import get_current_user, get_current_admin

router = APIRouter(prefix="/payments", tags=["Payments"])


def _ensure_order_access(order, current_user) -> None:
    is_admin = str(getattr(getattr(current_user, "role", None), "name", "")).upper() == "ADMIN"
    if is_admin:
        return
    if order.user_id is None or order.user_id != current_user.private_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only access payments for your own orders")


@router.post("/pay", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def process_order_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = order_service.get_order(payload.order_id, db)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order #{payload.order_id} not found")
    _ensure_order_access(order, current_user)

    if order.payment_status == "PAID":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Order #{payload.order_id} has already been paid for")

    # No payment gateway or verified confirmation callback is configured yet.
    # Never mark an order PAID based only on a client-supplied amount.
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Payment processing is not configured; no payment was recorded.",
    )


@router.post("/admin/verify", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def verify_order_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    """Record an offline payment only after an administrator verifies receipt."""
    order = order_service.get_order(payload.order_id, db)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order #{payload.order_id} not found",
        )
    if order.payment_status == "PAID":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Order #{payload.order_id} is already marked as paid",
        )
    if order.order_status == "CANCELLED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cancelled orders cannot be marked as paid",
        )
    if payload.payment_method != order.payment_method:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The verified payment method must match the method selected on the order",
        )

    try:
        return payment_service.create_payment(
            order_id=order.id,
            payment_method=order.payment_method,
            amount=payload.amount,
            session=db,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get("/{payment_id}", response_model=PaymentOut)
def get_payment_details(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    payment = payment_service.get_payment(payment_id, db)
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Payment #{payment_id} not found")
    _ensure_order_access(payment.order, current_user)
    return payment


@router.get("/order/{order_id}", response_model=PaymentOut)
def get_payment_by_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    payment = payment_service.get_payment_by_order_id(order_id, db)
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No payment recorded yet for Order #{order_id}")
    _ensure_order_access(payment.order, current_user)
    return payment


@router.get("", response_model=List[PaymentOut], dependencies=[Depends(get_current_admin)])
def list_payments(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return payment_service.get_all_payments(session=db, offset=offset, limit=limit)
