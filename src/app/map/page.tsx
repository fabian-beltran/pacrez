"use client";

import { ActionIcon, Box, Stack } from "@mantine/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import campusMap from "@/../public/images/campus-map.webp";
import { IconMinus, IconPlus } from "@tabler/icons-react";

export default function CampusMap() {
	return (
		<Box pos="relative">
			<TransformWrapper initialScale={2} minScale={1} maxScale={10} centerOnInit centerZoomedOut>
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
							<Image src={campusMap} alt="map" style={{ height: "90vh", width: "auto" }} />
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		</Box>
	);
}
