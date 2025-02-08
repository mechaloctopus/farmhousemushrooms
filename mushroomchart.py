import json
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

def create_pdf(data, filename):
    # Set up page parameters and margins.
    page_width, page_height = letter
    margin = 36  # 0.5 inch margins
    available_width = page_width - 2 * margin
    # Adjust columns: 20% for the image (smaller) and 80% for the text.
    left_width = available_width * 0.2
    right_width = available_width * 0.8

    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin
    )
    elements = []
    styles = getSampleStyleSheet()
    # Create a smaller paragraph style for mushroom info.
    mushroom_style = styles["BodyText"]
    mushroom_style.fontSize = 6
    mushroom_style.leading = 7  # further reduced line spacing for a compact layout

    mushrooms = data.get("mushrooms", [])
    for idx, mushroom in enumerate(mushrooms):
        # --- Prepare the image ---
        image_path = mushroom.get("imagePath", "")
        if image_path:
            # Get the base directory of the current script.
            base_dir = os.path.dirname(os.path.abspath(__file__))
            # First try treating image_path as relative to base_dir.
            test_path = os.path.join(base_dir, image_path)
            if os.path.exists(test_path):
                full_image_path = test_path
            else:
                # Fallback: assume the image is in the "images" subfolder.
                full_image_path = os.path.join(base_dir, "images", image_path)

            if os.path.exists(full_image_path):
                try:
                    img = Image(full_image_path)
                    # Scale the image to fit the left column while preserving the aspect ratio.
                    img.drawWidth = left_width
                    aspect = img.imageHeight / float(img.imageWidth)
                    # Downscale the image: restrict its height to at most 80% of left_width
                    calculated_height = left_width * aspect
                    max_img_height = left_width * 0.8
                    if calculated_height > max_img_height:
                        img.drawHeight = max_img_height
                        img.drawWidth = max_img_height / aspect
                    else:
                        img.drawHeight = calculated_height
                except Exception as e:
                    img = Paragraph("Image failed to load", mushroom_style)
            else:
                img = Paragraph("Image file not found", mushroom_style)
        else:
            img = Paragraph("No image", mushroom_style)

        # --- Build the text block with all the details ---
        info_lines = []
        info_lines.append(f"<b>ID:</b> {mushroom.get('id', '')}")
        info_lines.append(f"<b>Common Name:</b> {mushroom.get('commonName', '')}")
        info_lines.append(f"<b>Scientific Name:</b> {mushroom.get('scientificName', '')}")
        alt_names = ", ".join(mushroom.get("alternateNames", []))
        info_lines.append(f"<b>Alternate Names:</b> {alt_names}")
        # Flavor Profile with any sources
        flavor = mushroom.get("flavorProfile", {})
        flavor_desc = flavor.get("description", "")
        if "sources" in flavor:
            flavor_sources = ", ".join(source.get("reference", "") for source in flavor["sources"])
            info_lines.append(f"<b>Flavor Profile:</b> {flavor_desc} <br/><b>Sources:</b> {flavor_sources}")
        else:
            info_lines.append(f"<b>Flavor Profile:</b> {flavor_desc}")
        # Recipe details
        recipes = mushroom.get("recipes", [])
        if recipes:
            recipe_lines = "<br/>".join(
                [f"<b>{rec.get('name', '')}</b>: {rec.get('description', '')} (URL: {rec.get('url', '')})"
                 for rec in recipes]
            )
            info_lines.append(f"<b>Recipes:</b><br/>{recipe_lines}")
        # Health Benefits and optional studies
        health = mushroom.get("healthBenefits", {})
        health_desc = health.get("description", "")
        if "studies" in health:
            health_studies = "; ".join(study.get("title", "") for study in health["studies"])
            info_lines.append(f"<b>Health Benefits:</b> {health_desc} <br/><b>Studies:</b> {health_studies}")
        else:
            info_lines.append(f"<b>Health Benefits:</b> {health_desc}")
        # Other details
        folklore = mushroom.get("folkloreHistory", {})
        info_lines.append(f"<b>Folklore History:</b> {folklore.get('description', '')}")
        info_lines.append(f"<b>Cultivation Tips:</b> {mushroom.get('cultivationTips', '')}")
        ident = mushroom.get("identificationFeatures", {})
        info_lines.append(
            f"<b>Identification:</b> Spore Print: {ident.get('sporePrint', '')}, Cap Texture: {ident.get('capTexture', '')}"
        )
        info_lines.append(
            f"<b>Misc:</b> Price: {mushroom.get('price', '')}, Stock Schedule: {mushroom.get('stockSchedule', '')}, Stock Status: {mushroom.get('stockStatus', '')}"
        )
        info_text = "<br/>".join(info_lines)
        paragraph = Paragraph(info_text, mushroom_style)

        # --- Layout the mushroom box using a two-column table ---
        row = [[img, paragraph]]
        t = Table(row, colWidths=[left_width, right_width])
        t.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 0.5, colors.darkgrey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('INNERPADDING', (0, 0), (-1, -1), 4),
            ('FONTSIZE', (0, 0), (-1, -1), 6),
        ]))
        # Append the mushroom box directly.
        elements.append(t)
        elements.append(Spacer(1, 4))

    doc.build(elements)

if __name__ == "__main__":
    # Load JSON data from mushrooms.json and create the PDF.
    with open("mushrooms.json", "r") as f:
        data = json.load(f)
    create_pdf(data, "mushrooms.pdf")
