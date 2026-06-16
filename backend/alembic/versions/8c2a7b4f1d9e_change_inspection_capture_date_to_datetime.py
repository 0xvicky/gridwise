"""change inspection capture date to datetime

Revision ID: 8c2a7b4f1d9e
Revises: 1def940f3fff
Create Date: 2026-06-16 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8c2a7b4f1d9e'
down_revision: Union[str, Sequence[str], None] = '1def940f3fff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        'inspections',
        'capture_date',
        existing_type=sa.Date(),
        type_=sa.DateTime(timezone=True),
        existing_nullable=False,
        postgresql_using='capture_date::timestamp with time zone',
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        'inspections',
        'capture_date',
        existing_type=sa.DateTime(timezone=True),
        type_=sa.Date(),
        existing_nullable=False,
        postgresql_using='capture_date::date',
    )
