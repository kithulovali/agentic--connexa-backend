from decimal import Decimal

from models import Product
from models.utils import ProductStatus
from services.ai_service import smart_search_electronics, get_electronics_recommendations
from services.lookup_service import get_lookup


def test_ai_shopping_search_and_recommendations_exclude_out_of_stock(session):
    # Resolve lookup rows before creating Products; otherwise lookup seeding can
    # trigger autoflush while a transient Product is attached to the relationship.
    available_status = get_lookup(session, ProductStatus, "AVAILABLE")
    empty_status = get_lookup(session, ProductStatus, "EMPTY")

    available = Product(
        name="Wireless headphones", price=Decimal("40.00"), quantity=2,
        product_status_record=available_status,
    )
    empty = Product(
        name="Wireless headphones out of stock", price=Decimal("35.00"), quantity=0,
        product_status_record=empty_status,
    )
    session.add_all([available, empty])
    session.commit()

    search = smart_search_electronics(session, "wireless headphones")
    recommendations = get_electronics_recommendations(session, "wireless headphones")

    assert [p.id for p in search["matches"]] == [available.id]
    assert search["total_matches"] == 1
    assert [p.id for p in recommendations["recommendations"]] == [available.id]



def test_recommendations_do_not_return_unrelated_products(session):
    available_status = get_lookup(session, ProductStatus, "AVAILABLE")
    product = Product(
        name="Business laptop",
        price=Decimal("700.00"),
        quantity=5,
        description="Portable computer for office work",
        product_status_record=available_status,
    )
    session.add(product)
    session.commit()

    result = get_electronics_recommendations(
        session, "noise cancelling headphones"
    )

    assert result["recommendations"] == []
    assert "no matching available products were found" in result["ai_advice"]



def test_recommendations_enforce_explicit_budget_from_query(session):
    available_status = get_lookup(session, ProductStatus, "AVAILABLE")
    affordable = Product(
        name="Business laptop",
        price=Decimal("850.00"),
        quantity=3,
        description="Portable computer for programming and office work",
        product_status_record=available_status,
    )
    over_budget = Product(
        name="Premium laptop",
        price=Decimal("1250.00"),
        quantity=4,
        description="High performance portable computer for programming",
        product_status_record=available_status,
    )
    session.add_all([affordable, over_budget])
    session.commit()

    result = get_electronics_recommendations(
        session, "Recommend a laptop under $1,000"
    )

    assert [product.id for product in result["recommendations"]] == [affordable.id]
    assert "maximum budget of 1000" in result["ai_advice"]
