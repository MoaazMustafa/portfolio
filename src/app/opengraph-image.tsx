import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Moaaz Mustafa - Software Engineer & Tech Enthusiast';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0a 50%, #0a0a0a 100%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(172,236,0,0.25) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,188,6,0.2) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              letterSpacing: '-2px',
              background: 'linear-gradient(90deg, #ffffff 0%, #acec00 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
            }}
          >
            MOAAZ MUSTAFA
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Software Engineer & Tech Enthusiast
          </div>
          <div
            style={{
              marginTop: '24px',
              fontSize: '18px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '2px',
            }}
          >
            moaazmustafa.dev
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
