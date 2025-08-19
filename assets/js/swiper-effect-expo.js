// swiper-effect-expo.js
function createEffect({ effect, swiper, on, setTranslate, setTransition, perspective, overwriteParams }) {
  on("beforeInit", () => {
    if (swiper.params.effect !== effect) return;

    swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
    if (perspective && perspective()) {
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    }
    const params = overwriteParams ? overwriteParams() : {};
    Object.assign(swiper.params, params);
    Object.assign(swiper.originalParams, params);
  });

  on("setTranslate", () => {
    if (swiper.params.effect === effect) setTranslate();
  });

  on("setTransition", (s, duration) => {
    if (swiper.params.effect === effect) setTransition(duration);
  });
}

// Expo Effect
export default function SwiperEffectExpo({ swiper, on, extendParams }) {
  extendParams({
    expoEffect: {
      imageScale: 1.125,
      imageOffset: 1.25,
      scale: 1.25,
      rotate: 0,
      grayscale: true,
    },
  });

  const setTranslate = () => {
    const { slides, rtlTranslate } = swiper;
    const d = swiper.isHorizontal();
    const effectParams = swiper.params.expoEffect;

    const imageOffset = Math.max(1.25, effectParams.imageOffset);
    const imageScale = Math.max(1.125, effectParams.imageScale);
    const scale = Math.max(1.25, effectParams.scale);
    const direction = rtlTranslate ? -1 : 1;

    slides.forEach((slide) => {
      const container = slide.querySelector(".expo-container");
      const content = slide.querySelector(".expo-content");
      const image = slide.querySelector(".expo-image");
      const progress = slide.progress;
      const limitedProgress = Math.max(Math.min(progress, 1), -1);

      // Image transform
      if (image) {
        image.style.transform = `translate${d ? "X" : "Y"}(${limitedProgress * 50 * direction}%) scale(${
          1 + (imageScale - 1) * Math.abs(limitedProgress)
        })`;
        if (effectParams.grayscale) {
          image.style.filter = `grayscale(${Math.abs(limitedProgress)})`;
        }
      }

      // Container transform
      if (container) {
        container.style.transform = `scale(${1 + (scale - 1) * Math.abs(limitedProgress)}) rotate${
          d ? "Y" : "X"
        }(${effectParams.rotate * limitedProgress * (d ? 1 : -1) * direction}deg)`;
      }

      // Content transform
      if (content) {
        // content.style.transform = `translateY(${limitedProgress * 10 * direction}%)`;
       
        let translateY = -limitedProgress * 10 * direction; 

        // Nếu slide rời đi, cho nó đi tiếp lên trên
        if (limitedProgress > 0) {
            translateY = limitedProgress * 10 * direction; 
        }

        content.style.transform = `translateY(${translateY}%)`;
        content.style.opacity = 1 - Math.abs(limitedProgress) * 2;
      }
    });
  };

  const setTransition = (duration) => {
    const { slides } = swiper;
    slides.forEach((slide) => {
      [slide, ...slide.querySelectorAll(".expo-container, .expo-image, .expo-content")].forEach((el) => {
        el.style.transitionDuration = `${duration}ms`;
      });
    });
  };

  createEffect({
    effect: "expo",
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      centeredSlides: true,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
    }),
  });
}
