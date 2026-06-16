import os
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.inspection import Inspection
from models.defects import Defects
from models.asset import Asset
from fastapi import HTTPException
from models.enums import AnalysisStatus
from pathlib import Path
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER




def write_pdf(
    file_path: Path,
    asset: Asset,
    inspection: Inspection,
    defects: list[Defects],
):
    doc = SimpleDocTemplate(
        str(file_path),
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()

    wrap_style = ParagraphStyle(
        "WrapStyle",
        parent=styles["BodyText"],
        fontSize=9,
        leading=12,
        wordWrap="CJK",
    )

    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=24,
        spaceAfter=20,
    )

    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        spaceBefore=15,
        spaceAfter=10,
    )

    content = []

    # ==================================================
    # TITLE
    # ==================================================

    content.append(
        Paragraph(
            "Infrastructure Inspection Report",
            title_style,
        )
    )

    content.append(
        Paragraph(
            f"Inspection ID: {inspection.id}",
            styles["BodyText"],
        )
    )

    content.append(Spacer(1, 20))

    # ==================================================
    # HEALTH SCORE
    # ==================================================

    health = inspection.health_score or 0

    if health >= 80:
        health_status = "GOOD"
    elif health >= 60:
        health_status = "MODERATE"
    else:
        health_status = "CRITICAL"

    content.append(
        Paragraph(
            "Asset Health Summary",
            section_style,
        )
    )

    health_table = Table(
        [
            ["Health Score", str(health)],
            ["Status", health_status],
        ],
        colWidths=[180, 250],
    )

    health_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
            ]
        )
    )

    content.append(health_table)
    content.append(Spacer(1, 20))

    # ==================================================
    # ASSET DETAILS
    # ==================================================

    content.append(
        Paragraph(
            "Asset Information",
            section_style,
        )
    )

    asset_table = Table(
        [
            ["Asset Name", asset.name],
            ["Asset Type", asset.asset_type.value],
            ["Zone", asset.zone],
            ["Installed Year", str(asset.installed_year)],
            ["Latitude", str(asset.latitude)],
            ["Longitude", str(asset.longitude)],
        ],
        colWidths=[180, 250],
    )

    asset_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
            ]
        )
    )

    content.append(asset_table)
    content.append(Spacer(1, 20))

    # ==================================================
    # INSPECTION DETAILS
    # ==================================================

    content.append(
        Paragraph(
            "Inspection Details",
            section_style,
        )
    )

    inspection_table = Table(
        [
            ["Pilot ID", inspection.pilot_id],
            ["Capture Date", str(inspection.capture_date)],
            ["Validation Status", inspection.validation_status.value],
            ["Analysis Status", inspection.analysis_status.value],
        ],
        colWidths=[180, 250],
    )

    inspection_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
            ]
        )
    )

    content.append(inspection_table)
    content.append(Spacer(1, 20))

    # ==================================================
    # DEFECTS
    # ==================================================

    content.append(
        Paragraph(
            "Detected Defects",
            section_style,
        )
    )

    if not defects:
        content.append(
            Paragraph(
                "No defects detected during analysis.",
                styles["Normal"],
            )
        )

    else:
        for idx, defect in enumerate(defects, start=1):

            defect_table = Table(
                [
                    ["Defect #", str(idx)],
                    ["Type", defect.defect_type.value.upper()],
                    ["Severity", defect.severity.value.upper()],
                    [
                        "Location",
                        Paragraph(
                            defect.location_description,
                            wrap_style,
                        ),
                    ],
                    [
                        "Confidence",
                        f"{defect.confidence_score:.2f}",
                    ],
                    [
                        "AI Reasoning",
                        Paragraph(
                            defect.ai_reasoning,
                            wrap_style,
                        ),
                    ],
                    [
                        "AI Recommendation",
                        Paragraph(
                            defect.ai_recommendation,
                            wrap_style,
                        ),
                    ],
                ],
                colWidths=[100, 400],
            )

            defect_table.setStyle(
                TableStyle(
                    [
                        ("GRID", (0, 0), (-1, -1), 1, colors.black),
                        ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 8),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                        ("TOPPADDING", (0, 0), (-1, -1), 6),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                    ]
                )
            )

            content.append(defect_table)
            content.append(Spacer(1, 15))

    # ==================================================
    # FOOTER
    # ==================================================

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "Generated automatically by GridWise AI Inspection Engine",
            styles["Italic"],
        )
    )

    doc.build(content)

    return {
        "message": "pdf generated",
        "path": str(file_path),
    }
    

def is_report(inspection_id:UUID,asset_id:UUID):
    report_path=f"{os.getenv('SAVE_DIR') or 'SAVE_DIR'}/{asset_id}/{inspection_id}/reports/ai_report.pdf"
    return Path(report_path).exists()
    
    
async def generate(inspection_id: UUID, db: AsyncSession):

    inspection = await db.get(Inspection, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="inspection not found")
    asset = await db.get(Asset, inspection.asset_id)
    result = await db.execute(
        select(Defects).where(Defects.inspection == inspection_id)
    )
    defects = result.scalars().all()
    if inspection.analysis_status != AnalysisStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="ai still processing")
    report_path = (
        Path(os.getenv("SAVE_DIR"))
        / str(asset.id)
        / str(inspection_id)
        / "reports"
        / "ai_report.pdf"
    )
    report_path.parent.mkdir(parents=True, exist_ok=True)

    res = write_pdf(report_path, asset, inspection, defects)
    return res
