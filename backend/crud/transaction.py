from sqlalchemy.orm import Session

from backend.models.transaction import Transaction


def create_transaction(db: Session, transaction: Transaction):
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transaction(db: Session, transaction_id: int):
    return (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id)
        .first()
    )


def get_by_checkout_request_id(db: Session, checkout_request_id: str):
    return (
        db.query(Transaction)
        .filter(
            Transaction.checkout_request_id == checkout_request_id
        )
        .first()
    )


def update_transaction(db: Session, transaction: Transaction, **kwargs):
    for key, value in kwargs.items():
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)

    return transaction


def get_transactions(db: Session):
    return db.query(Transaction).all()