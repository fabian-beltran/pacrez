"use client";
import { ActionIcon, Box, Stack } from "@mantine/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import campusMap from "@/../public/images/campus-map.webp";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Building } from "@/lib/prisma-types";
import BuildingModal from "./BuildingModal";

export default function Map({ buildings }: { buildings: Building[] }) {
	const handleMapClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const target = e.currentTarget as HTMLDivElement;
		const rect = target.getBoundingClientRect();

		// Mouse position relative to image top-left
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Convert to percentage
		const mapLeft = (x / rect.width) * 100;
		const mapTop = (y / rect.height) * 100;

		console.log("mapTop:", mapTop.toFixed(2), "mapLeft:", mapLeft.toFixed(2));
	};

	return (
		<Box pos="relative">
			<TransformWrapper initialScale={3} minScale={1} maxScale={10} centerOnInit centerZoomedOut>
				{({ zoomIn, zoomOut }) => (
					<>
						{/* Zoom Controls (fixed over image) */}
						<Stack pos="absolute" top="1rem" left="1rem" style={{ zIndex: 10 }} gap="xs">
							<ActionIcon onClick={() => zoomIn()}>
								<IconPlus />
							</ActionIcon>
							<ActionIcon onClick={() => zoomOut()}>
								<IconMinus />
							</ActionIcon>
						</Stack>

						{/* Image */}
						<TransformComponent>
							<Box onClick={handleMapClick} pos="relative">
								<Image src={campusMap} alt="map" style={{ height: "90vh", width: "auto" }} />

								{buildings.map((b) => (
									<BuildingModal key={b.id} building={b} />
								))}
							</Box>
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		</Box>
	);
}
