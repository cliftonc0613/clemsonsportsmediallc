import { YouTubePlayer } from "@/components/YouTubePlayer";

export const metadata = {
  title: "Video Player Demo",
  description: "Demonstration of the YouTube video player component",
};

export default function VideoDemoPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1>YouTube Player Demo</h1>
          <p className="text-muted-foreground text-lg">
            A customizable YouTube video player built with Video.js
          </p>
        </header>

        <section className="space-y-6">
          <h2>Basic Usage</h2>
          <YouTubePlayer videoId="dQw4w9WgXcQ" />
        </section>

        <section className="space-y-6">
          <h2>With Custom Controls</h2>
          <p className="text-muted-foreground">
            Using native YouTube controls instead of Video.js controls:
          </p>
          <YouTubePlayer videoId="dQw4w9WgXcQ" ytControls />
        </section>

        <section className="space-y-6">
          <h2>Autoplay & Muted</h2>
          <p className="text-muted-foreground">
            Autoplay with muted audio (required by browsers):
          </p>
          <YouTubePlayer videoId="dQw4w9WgXcQ" autoplay muted />
        </section>

        <section className="space-y-8">
          <h2>Code Examples</h2>

          <div className="space-y-4">
            <h3>Basic Import</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { YouTubePlayer } from "@/components/YouTubePlayer";

<YouTubePlayer videoId="YOUR_VIDEO_ID" />`}</code>
            </pre>
          </div>

          <div className="space-y-4">
            <h3>With Event Handlers</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<YouTubePlayer
  videoId="YOUR_VIDEO_ID"
  onReady={(player) => console.log("Player ready:", player)}
  onPlay={() => console.log("Video started")}
  onPause={() => console.log("Video paused")}
  onEnded={() => console.log("Video ended")}
/>`}</code>
            </pre>
          </div>

          <div className="space-y-4">
            <h3>All Available Props</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`interface YouTubePlayerProps {
  videoId: string;       // YouTube video ID (required)
  className?: string;    // Additional CSS classes
  autoplay?: boolean;    // Auto-start video (default: false)
  controls?: boolean;    // Show controls (default: true)
  loop?: boolean;        // Loop video (default: false)
  muted?: boolean;       // Start muted (default: false)
  width?: number|string; // Player width (default: "100%")
  height?: number|string;// Player height (default: "auto")
  ytControls?: boolean;  // Use YouTube controls (default: false)
  onReady?: (player) => void;  // Player ready callback
  onPlay?: () => void;         // Play event callback
  onPause?: () => void;        // Pause event callback
  onEnded?: () => void;        // Video ended callback
}`}</code>
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
