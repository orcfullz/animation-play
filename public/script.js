const videoUrl = 'test.mp4';
    const frameContainer = document.getElementById('frame-container');
    let frames = [];
    let totalFrames;
    let FPS = 25; // Frames per second of the video

    fetch(videoUrl)
        .then(res => res.blob())
        .then(blob => {
            return new Promise((res) => {
                const fr = new FileReader();
                fr.onload = e => res(fr.result);
                fr.readAsDataURL(blob);
            })
        })
        .then(async (base64str) => {
            const video = document.createElement("video");
            video.src = base64str;
            video.muted = true;
            video.style.display = 'none'; // Hide the video element

            while (isNaN(video.duration)) {
                await new Promise((r) => setTimeout(r, 50));
            }

            totalFrames = Math.ceil(video.duration * FPS);
            frameContainer.style.height = `${totalFrames * 50}px`; // Extended scroll length
            console.log(`Total frames: ${totalFrames}`);

            video.currentTime = video.duration;

            while (video.currentTime) {
                if (video.currentTime - 1 / FPS < 0)
                    video.currentTime = 0;
                else
                    video.currentTime -= 1 / FPS;

                await new Promise((next) => {
                    video.addEventListener('seeked', () => {
                        const canvas = document.createElement("canvas");
                        Object.assign(canvas, {
                            width: video.videoWidth,
                            height: video.videoHeight
                        });
                        canvas.getContext("2d").drawImage(video, 0, 0);
                        frames.push(canvas);
                        console.log(`Extracted frame at ${video.currentTime}, total: ${frames.length}`);
                        next();
                    }, { once: true });
                });
            }

            // Create an img element for displaying frames
            const frameDisplay = document.createElement('img');
            frameContainer.appendChild(frameDisplay);

            // Scroll event listener to change frames
          // Inside your existing scroll event listener:

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const frameIndex = Math.floor(scrollTop / 50) % totalFrames;
    
    if (frames[frameIndex]) {
        requestAnimationFrame(() => {
            const frameDataUrl = frames[frameIndex].toDataURL('image/jpeg', 0.9);
            frameDisplay.src = frameDataUrl; // Update the img src

            frameDisplay.onload = () => {
                console.log(`Frame ${frameIndex} loaded successfully`);
            };

            frameDisplay.onerror = (e) => {
                console.error(`Error loading frame ${frameIndex}:`, e);
            };
        });
    }
});

        });