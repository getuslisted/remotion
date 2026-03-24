import React from 'react';
import {
	AbsoluteFill,
	Img,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const BRAND_GREEN = '#3FAF4D';
const BLACK = '#000000';
const WHITE = '#FFFFFF';

const services = [
	{
		title: 'Landscaping',
		description: 'Professional lawn care & maintenance',
		icon: '🌿',
	},
	{
		title: 'Snow Removal',
		description: 'Reliable winter storm response',
		icon: '❄️',
	},
	{
		title: 'Hardscaping',
		description: 'Patios, walkways & retaining walls',
		icon: '🧱',
	},
	{
		title: 'Tree Services',
		description: 'Trimming, removal & stump grinding',
		icon: '🌳',
	},
	{
		title: 'Irrigation',
		description: 'Installation & system maintenance',
		icon: '💧',
	},
	{
		title: 'Property Maintenance',
		description: 'Full-service commercial & residential',
		icon: '🏡',
	},
];

// Animated background grid lines
const GridLines: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	return (
		<svg
			style={{position: 'absolute', top: 0, left: 0, width, height, opacity: 0.06}}
		>
			{Array.from({length: 12}).map((_, i) => (
				<line
					key={`v${i}`}
					x1={(width / 12) * i}
					y1={0}
					x2={(width / 12) * i + (frame * 0.5) % width}
					y2={height}
					stroke={BRAND_GREEN}
					strokeWidth={1}
				/>
			))}
			{Array.from({length: 7}).map((_, i) => (
				<line
					key={`h${i}`}
					x1={0}
					y1={(height / 7) * i}
					x2={width}
					y2={(height / 7) * i}
					stroke={BRAND_GREEN}
					strokeWidth={1}
				/>
			))}
		</svg>
	);
};

// Animated green accent bar
const AccentBar: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const progress = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 120}});
	const width = interpolate(progress, [0, 1], [0, 120]);
	return (
		<div
			style={{
				width,
				height: 5,
				backgroundColor: BRAND_GREEN,
				borderRadius: 3,
				marginTop: 10,
				marginBottom: 16,
			}}
		/>
	);
};

// Intro scene with logo
const IntroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoScale = spring({frame, fps, config: {damping: 12, stiffness: 80}});
	const logoOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

	const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {extrapolateRight: 'clamp'});
	const taglineY = interpolate(frame, [30, 50], [20, 0], {extrapolateRight: 'clamp'});

	const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: BLACK,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<GridLines />

			{/* Green glow circle behind logo */}
			<div
				style={{
					position: 'absolute',
					width: 400,
					height: 400,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${BRAND_GREEN}33 0%, transparent 70%)`,
					transform: `scale(${logoScale})`,
					opacity: logoOpacity,
				}}
			/>

			{/* Logo */}
			<div
				style={{
					transform: `scale(${logoScale})`,
					opacity: logoOpacity,
					marginBottom: 40,
					zIndex: 2,
				}}
			>
				<Img
					src="https://www.coxenterprisesllc.com/wp-content/uploads/2024/05/Cox-Enterprises-Logo.png"
					style={{width: 480, objectFit: 'contain'}}
				/>
			</div>

			{/* Tagline */}
			<div
				style={{
					opacity: taglineOpacity,
					transform: `translateY(${taglineY}px)`,
					textAlign: 'center',
					zIndex: 2,
				}}
			>
				<div
					style={{
						fontSize: 42,
						fontWeight: 800,
						color: WHITE,
						fontFamily: 'Arial, sans-serif',
						letterSpacing: 2,
						textTransform: 'uppercase',
					}}
				>
					Excellence in Every Service
				</div>
			</div>

			{/* Subtitle */}
			<div
				style={{
					opacity: subtitleOpacity,
					marginTop: 16,
					zIndex: 2,
				}}
			>
				<div
					style={{
						fontSize: 22,
						color: BRAND_GREEN,
						fontFamily: 'Arial, sans-serif',
						letterSpacing: 4,
						textTransform: 'uppercase',
					}}
				>
					Professional • Reliable • Results
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Individual service card
const ServiceCard: React.FC<{
	service: (typeof services)[0];
	index: number;
	startFrame: number;
}> = ({service, index, startFrame}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const delay = startFrame + index * 12;
	const progress = spring({
		frame: frame - delay,
		fps,
		config: {damping: 14, stiffness: 120},
	});

	const opacity = interpolate(frame - delay, [0, 20], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
	const y = interpolate(progress, [0, 1], [60, 0]);
	const scale = interpolate(progress, [0, 1], [0.85, 1]);

	return (
		<div
			style={{
				opacity,
				transform: `translateY(${y}px) scale(${scale})`,
				background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
				border: `1px solid ${BRAND_GREEN}44`,
				borderRadius: 16,
				padding: '32px 28px',
				display: 'flex',
				flexDirection: 'column',
				boxShadow: `0 8px 32px ${BRAND_GREEN}22, 0 2px 8px rgba(0,0,0,0.5)`,
			}}
		>
			<div style={{fontSize: 52, marginBottom: 12}}>{service.icon}</div>
			<AccentBar delay={delay + 10} />
			<div
				style={{
					fontSize: 26,
					fontWeight: 700,
					color: WHITE,
					fontFamily: 'Arial, sans-serif',
					marginBottom: 8,
				}}
			>
				{service.title}
			</div>
			<div
				style={{
					fontSize: 18,
					color: '#aaaaaa',
					fontFamily: 'Arial, sans-serif',
					lineHeight: 1.4,
				}}
			>
				{service.description}
			</div>
		</div>
	);
};

// Services showcase scene
const ServicesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleProgress = spring({frame, fps, config: {damping: 12, stiffness: 80}});
	const titleOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
	const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

	return (
		<AbsoluteFill style={{backgroundColor: BLACK, padding: '60px 80px'}}>
			<GridLines />

			{/* Section header */}
			<div
				style={{
					opacity: titleOpacity,
					transform: `translateY(${titleY}px)`,
					marginBottom: 48,
				}}
			>
				<div
					style={{
						fontSize: 18,
						color: BRAND_GREEN,
						fontFamily: 'Arial, sans-serif',
						letterSpacing: 5,
						textTransform: 'uppercase',
						marginBottom: 8,
					}}
				>
					What We Offer
				</div>
				<div
					style={{
						fontSize: 52,
						fontWeight: 900,
						color: WHITE,
						fontFamily: 'Arial, sans-serif',
						lineHeight: 1,
					}}
				>
					Our Services
				</div>
				<div
					style={{
						width: interpolate(frame, [10, 40], [0, 200], {extrapolateRight: 'clamp'}),
						height: 5,
						backgroundColor: BRAND_GREEN,
						borderRadius: 3,
						marginTop: 16,
					}}
				/>
			</div>

			{/* Service cards grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 28,
				}}
			>
				{services.map((service, i) => (
					<ServiceCard key={service.title} service={service} index={i} startFrame={20} />
				))}
			</div>
		</AbsoluteFill>
	);
};

// CTA / Outro scene
const OutroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bgScale = interpolate(frame, [0, 90], [1.05, 1], {extrapolateRight: 'clamp'});

	const logoOpacity = interpolate(frame, [10, 35], [0, 1], {extrapolateRight: 'clamp'});
	const logoScale = spring({frame: frame - 10, fps, config: {damping: 14, stiffness: 100}});

	const ctaOpacity = interpolate(frame, [35, 55], [0, 1], {extrapolateRight: 'clamp'});
	const ctaY = interpolate(frame, [35, 55], [20, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});

	const urlOpacity = interpolate(frame, [55, 75], [0, 1], {extrapolateRight: 'clamp'});

	const pulseScale = 1 + 0.015 * Math.sin((frame / 15) * Math.PI);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: BLACK,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
			}}
		>
			{/* Animated background radial gradient */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse at center, ${BRAND_GREEN}1a 0%, transparent 65%)`,
					transform: `scale(${bgScale})`,
				}}
			/>

			<GridLines />

			{/* Pulsing ring */}
			<div
				style={{
					position: 'absolute',
					width: 500,
					height: 500,
					borderRadius: '50%',
					border: `2px solid ${BRAND_GREEN}44`,
					transform: `scale(${pulseScale})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 360,
					height: 360,
					borderRadius: '50%',
					border: `1px solid ${BRAND_GREEN}22`,
					transform: `scale(${pulseScale * 0.97})`,
				}}
			/>

			{/* Logo */}
			<div
				style={{
					opacity: logoOpacity,
					transform: `scale(${logoScale})`,
					marginBottom: 44,
					zIndex: 2,
				}}
			>
				<Img
					src="https://www.coxenterprisesllc.com/wp-content/uploads/2024/05/Cox-Enterprises-Logo.png"
					style={{width: 400, objectFit: 'contain'}}
				/>
			</div>

			{/* CTA text */}
			<div
				style={{
					opacity: ctaOpacity,
					transform: `translateY(${ctaY}px)`,
					textAlign: 'center',
					zIndex: 2,
					marginBottom: 24,
				}}
			>
				<div
					style={{
						fontSize: 46,
						fontWeight: 900,
						color: WHITE,
						fontFamily: 'Arial, sans-serif',
						marginBottom: 12,
					}}
				>
					Ready to Get Started?
				</div>
				<div
					style={{
						fontSize: 24,
						color: BRAND_GREEN,
						fontFamily: 'Arial, sans-serif',
						letterSpacing: 2,
					}}
				>
					Contact Us Today
				</div>
			</div>

			{/* Website URL */}
			<div
				style={{
					opacity: urlOpacity,
					zIndex: 2,
					background: `linear-gradient(90deg, ${BRAND_GREEN}33, ${BRAND_GREEN}55, ${BRAND_GREEN}33)`,
					border: `1px solid ${BRAND_GREEN}88`,
					borderRadius: 50,
					padding: '14px 40px',
				}}
			>
				<div
					style={{
						fontSize: 26,
						color: WHITE,
						fontFamily: 'Arial, sans-serif',
						fontWeight: 600,
						letterSpacing: 1,
					}}
				>
					www.coxenterprisesllc.com
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Total: 1800 frames at 30fps = 60 seconds
// Intro:    0 - 90  (3s)
// Services: 90 - 1620 (51s)  — gives cards time to settle and be read
// Outro:    1620 - 1800 (6s)
export const CoxEnterprises: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: BLACK}}>
			<Sequence durationInFrames={90}>
				<IntroScene />
			</Sequence>
			<Sequence from={90} durationInFrames={1530}>
				<ServicesScene />
			</Sequence>
			<Sequence from={1620} durationInFrames={180}>
				<OutroScene />
			</Sequence>
		</AbsoluteFill>
	);
};
