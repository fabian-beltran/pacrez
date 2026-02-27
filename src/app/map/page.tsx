"use client";

import { ActionIcon, Box, Stack, UnstyledButton } from "@mantine/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import campusMap from "@/../public/images/campus-map.webp";
import { IconMinus, IconPlus } from "@tabler/icons-react";

const locations = [
	{ label: "DUC", top: "41%", left: "61%" },
	{ label: "Main Gym", top: "56%", left: "54%" },
	{ label: "Owen Hall", top: "53%", left: "54%" },
	{ label: "WPC", top: "65%", left: "54.5%" },
	{ label: "CTC", top: "64.5%", left: "62%" },
	{ label: "Kourny Hall", top: "60.5%", left: "65%" },
	{ label: "Anderson Hall", top: "56%", left: "69%" },
	{ label: "Baun Hall", top: "55%", left: "65.5%" },
	{ label: "Morris Chapel", top: "46%", left: "87%" },
	{ label: "Library", top: "63%", left: "79%" },
	{ label: "Weber Hall", top: "51.5%", left: "83.5%" },
	{ label: "Grace Covell", top: "46%", left: "79.5%" },
];

const MapButton = ({ label, top, left }: { label: string; top: string; left: string }) => {
	return (
		<UnstyledButton
			pos="absolute"
			top={top}
			left={left}
			style={{
				transform: "translate(-50%, -50%)",
				opacity: 0.9,
				fontSize: 8,
				color: "white",
				borderRadius: 2,
			}}
			bg="brand"
			p={3}
		>
			{label}
		</UnstyledButton>
	);
};

export default function CampusMap() {
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
							<Image src={campusMap} alt="map" style={{ height: "90vh", width: "auto" }} />

							{locations.map((location) => (
								<MapButton
									key={location.label}
									label={location.label}
									top={location.top}
									left={location.left}
								/>
							))}
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		</Box>
	);
}
