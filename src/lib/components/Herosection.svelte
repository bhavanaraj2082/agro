<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AgriConnect - Premium Seeds & Agricultural Solutions</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .fade-in-up {
                animation: fadeInUp 0.8s ease-out forwards;
            }
            .slide-in {
                animation: slideIn 0.8s ease-out forwards;
            }
            .gradient-text {
                background: linear-gradient(135deg, #059669, #34d399);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .floating {
                animation: float 6s ease-in-out infinite;
            }
            @keyframes float {
                0%,
                100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-20px);
                }
            }
            .pulse-ring {
                animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)
                    infinite;
            }
            @keyframes pulse-ring {
                0% {
                    transform: scale(0.33);
                }
                80%,
                100% {
                    opacity: 0;
                }
            }
        </style>
    </head>
    <body
        class="font-sans bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-x-hidden"
    >
        <section class="  py-2 relative overflow-hidden">
            <div
                class="absolute inset-0 bg-gradient-to-br from-green-100/50 via-emerald-100/30 to-teal-100/50"
            ></div>
            <div class="container mx-auto relative z-10">
                <div
                    class="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]"
                >
                    <!-- Left Content (Dynamic) -->
                    <div class="space-y-8">
                        <div
                            id="hero-content"
                            class="transition-all duration-500"
                        >
                            <!-- Content will be dynamically updated -->
                        </div>
                        <div class="flex flex-wrap gap-4">
                            <a href="/products">
                                <button
                                    class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-base font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <span>Explore Products</span>
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        ></path>
                                    </svg>
                                </button>
                            </a>
                        </div>
                        <div
                            class="flex items-center space-x-8 text-sm text-green-700"
                        >
                            <div class="flex items-center space-x-2">
                                <div
                                    class="w-3 h-3 bg-green-500 rounded-full pulse-ring"
                                ></div>
                                <span>500+ Happy Farmers</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div
                                    class="w-3 h-3 bg-emerald-500 rounded-full pulse-ring"
                                ></div>
                                <span>50+ Seed Varieties</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div
                                    class="w-3 h-3 bg-teal-500 rounded-full pulse-ring"
                                ></div>
                                <span>99% Success Rate</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right Images (Auto-scrolling) -->
                    <div class="relative">
                        <div
                            class="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl"
                        >
                            <div
                                id="image-slider"
                                class="w-full h-full relative"
                            >
                                <!-- Images will be dynamically loaded -->
                            </div>
                            <!-- Image indicators -->
                            <div
                                class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
                            >
                                <div
                                    class="indicator w-2 h-2 bg-white/60 rounded-full cursor-pointer transition-all duration-300"
                                    data-slide="0"
                                ></div>
                                <div
                                    class="indicator w-2 h-2 bg-white/60 rounded-full cursor-pointer transition-all duration-300"
                                    data-slide="1"
                                ></div>
                                <div
                                    class="indicator w-2 h-2 bg-white/60 rounded-full cursor-pointer transition-all duration-300"
                                    data-slide="2"
                                ></div>
                                <div
                                    class="indicator w-2 h-2 bg-white/60 rounded-full cursor-pointer transition-all duration-300"
                                    data-slide="3"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decorative elements -->
            <div
                class="absolute top-1/4 left-10 w-2 h-2 bg-green-400 rounded-full opacity-60 floating"
            ></div>
            <div
                class="absolute top-1/3 right-20 w-3 h-3 bg-emerald-400 rounded-full opacity-60 floating"
                style="animation-delay: 1s;"
            ></div>
            <div
                class="absolute bottom-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full opacity-60 floating"
                style="animation-delay: 3s;"
            ></div>
        </section>

        <!-- Features Grid -->
        <section class="py-20 bg-white/50 backdrop-blur-sm">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold gradient-text mb-4">
                        Why Choose AgriConnect?
                    </h2>
                    <p class="text-xl text-green-700 max-w-2xl mx-auto">
                        Discover the difference premium seeds and expert
                        guidance can make for your agricultural success.
                    </p>
                </div>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <div
                        class="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100"
                    >
                        <div
                            class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        >
                            <svg
                                class="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                ></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-green-800 mb-3">
                            Premium Quality
                        </h3>
                        <p class="text-green-600">
                            Hand-selected, certified organic seeds with
                            guaranteed purity and germination rates above 95%.
                        </p>
                    </div>

                    <div
                        class="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100"
                    >
                        <div
                            class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        >
                            <svg
                                class="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                ></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-green-800 mb-3">
                            Higher Yields
                        </h3>
                        <p class="text-green-600">
                            Advanced hybrid varieties engineered for 30-50%
                            higher yields compared to traditional seeds.
                        </p>
                    </div>

                    <div
                        class="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100"
                    >
                        <div
                            class="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        >
                            <svg
                                class="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                ></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-green-800 mb-3">
                            Disease Resistant
                        </h3>
                        <p class="text-green-600">
                            Scientifically developed resistance to common plant
                            diseases and environmental stresses.
                        </p>
                    </div>

                    <div
                        class="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100"
                    >
                        <div
                            class="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        >
                            <svg
                                class="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                ></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-green-800 mb-3">
                            Expert Support
                        </h3>
                        <p class="text-green-600">
                            24/7 agricultural consultation with certified
                            agronomists and planting specialists.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <script>
            // Auto-scrolling hero content and images
            const heroContent = [
                {
                    title: "Growing Together with the<br>Best Seeds",
                    subtitle: "Premium Quality Seeds",
                    description:
                        "At agriConnect, we bring farmers and growers the finest seed varieties to cultivate healthier, more abundant harvests — season after season.",
                    image: "/farmers.webp",
                },
                {
                    title: "Revolutionary<br>Organic Solutions",
                    subtitle: "100% Organic Certified",
                    description:
                        "Experience the power of nature with our certified organic seeds. Grown without harmful chemicals, perfect for sustainable farming practices.",
                    image: "/landscpe.jpeg",
                },
                {
                    title: "Advanced Hybrid<br>Technology",
                    subtitle: "Science Meets Nature",
                    description:
                        "Our advanced hybrid varieties combine cutting-edge agricultural science with natural growing processes for maximum yield and quality.",
                    image: "/advance.jpg",
                },
                {
                    title: "Expert Agricultural<br>Consultation",
                    subtitle: "24/7 Support Available",
                    description:
                        "Get personalized guidance from our team of certified agronomists and plant specialists. Success is just a consultation away.",
                    image: "/consult.webp",
                },
            ];

            let currentSlide = 0;
            const totalSlides = heroContent.length;

            function updateHeroContent(index) {
                const content = heroContent[index];
                const heroContentDiv = document.getElementById("hero-content");
                const imageSlider = document.getElementById("image-slider");

                // Update content with animation
                heroContentDiv.style.opacity = "0";
                imageSlider.style.opacity = "0";

                setTimeout(() => {
                    heroContentDiv.innerHTML = `
                    <div class="space-y-6 fade-in-up">
                        <div class="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            ${content.subtitle}
                        </div>
                        <h1 class="text-4xl  font-bold text-green-800 leading-tight">
                            ${content.title}
                        </h1>
                        <p class="text-base text-green-700 leading-relaxed max-w-xl">
                            ${content.description}
                        </p>
                    </div>
                `;

                    imageSlider.innerHTML = `
                    <img src="${content.image}" alt="Agricultural scene" class="w-full h-full object-cover slide-in" />
                `;

                    heroContentDiv.style.opacity = "1";
                    imageSlider.style.opacity = "1";

                    // Update indicators
                    document
                        .querySelectorAll(".indicator")
                        .forEach((indicator, i) => {
                            if (i === index) {
                                indicator.classList.add("bg-white");
                                indicator.classList.remove("bg-white/60");
                            } else {
                                indicator.classList.remove("bg-white");
                                indicator.classList.add("bg-white/60");
                            }
                        });
                }, 200);
            }

            // Initialize first slide
            updateHeroContent(0);

            // Auto-scroll functionality
            setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateHeroContent(currentSlide);
            }, 4000);

            // Manual slide control
            document
                .querySelectorAll(".indicator")
                .forEach((indicator, index) => {
                    indicator.addEventListener("click", () => {
                        currentSlide = index;
                        updateHeroContent(currentSlide);
                    });
                });

            // Smooth scrolling for navigation
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    const target = document.querySelector(
                        this.getAttribute("href"),
                    );
                    if (target) {
                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }
                });
            });

            // Add scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("fade-in-up");
                    }
                });
            }, observerOptions);

            // Observe elements for scroll animations
            document.querySelectorAll(".group").forEach((el) => {
                observer.observe(el);
            });
        </script>
    </body>
</html>
