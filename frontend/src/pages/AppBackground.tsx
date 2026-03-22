import greenImg from '../images/green.png';
import redImg from '../images/red.png';
import yellowImg from '../images/yellow.png';

export default function AppBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none', zIndex: 0,
      overflow: 'hidden',
      background: 'white',
    }}>

      {/* Soft background blobs */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px',
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '30%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(250,240,100,0.07) 0%, transparent 70%)',
      }} />

      {/* Top-right: red starburst, large */}
      <img src={redImg} alt="" style={{
        position: 'absolute', top: 60, right: 80,
        width: 88, height: 88,
        opacity: 0.33, transform: 'rotate(18deg)',
      }} />

      {/* Top-left: yellow star, small */}
      <img src={yellowImg} alt="" style={{
        position: 'absolute', top: 140, left: 60,
        width: 48, height: 48,
        opacity: 0.38, transform: 'rotate(-8deg)',
      }} />

      {/* Mid-left: green cross, medium */}
      <img src={greenImg} alt="" style={{
        position: 'absolute', top: '38%', left: 32,
        width: 64, height: 64,
        opacity: 0.30, transform: 'rotate(12deg)',
      }} />

      {/* Mid-right: yellow star, medium */}
      <img src={yellowImg} alt="" style={{
        position: 'absolute', top: '30%', right: 48,
        width: 56, height: 56,
        opacity: 0.38, transform: 'rotate(-20deg)',
      }} />

      {/* Center: red starburst, tiny, very faint */}
      <img src={redImg} alt="" style={{
        position: 'absolute', top: '55%', left: '52%',
        width: 38, height: 38,
        opacity: 0.34, transform: 'rotate(5deg)',
      }} />

      {/* Bottom-right: green cross, medium */}
      <img src={greenImg} alt="" style={{
        position: 'absolute', bottom: 100, right: 120,
        width: 70, height: 70,
        opacity: 0.30, transform: 'rotate(-14deg)',
      }} />

      {/* Bottom-left: red starburst, small */}
      <img src={redImg} alt="" style={{
        position: 'absolute', bottom: 160, left: 100,
        width: 44, height: 44,
        opacity: 0.40, transform: 'rotate(30deg)',
      }} />

      {/* Bottom-center: yellow star, large, very faint */}
      <img src={yellowImg} alt="" style={{
        position: 'absolute', bottom: 40, left: '44%',
        width: 80, height: 80,
        opacity: 0.32, transform: 'rotate(10deg)',
      }} />

      {/* Upper-center-right: green cross, tiny */}
      <img src={greenImg} alt="" style={{
        position: 'absolute', top: '18%', right: '28%',
        width: 32, height: 32,
        opacity: 0.38, transform: 'rotate(-6deg)',
      }} />

    </div>
  );
}