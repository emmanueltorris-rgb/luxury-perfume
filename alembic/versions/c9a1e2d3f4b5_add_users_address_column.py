"""Add the legacy users.address column.

Revision ID: c9a1e2d3f4b5
Revises: fa25fc4a2256
Create Date: 2026-08-09
"""

from typing import Sequence, Union

from alembic import op


revision: str = "c9a1e2d3f4b5"
down_revision: Union[str, Sequence[str], None] = "fa25fc4a2256"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Older deployed databases predate this model field.  IF NOT EXISTS keeps
    # the migration safe for databases created from the existing initial schema.
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255)")


def downgrade() -> None:
    op.execute("ALTER TABLE users DROP COLUMN IF EXISTS address")
