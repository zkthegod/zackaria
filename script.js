document.addEventListener('DOMContentLoaded', function() {
	// Initial site loader
	const loader = document.getElementById('siteLoader');
	if (loader) {
		loader.classList.add('active');
		setTimeout(() => {
			loader.classList.remove('active');
		}, 250);
	}

	// Mobile menu toggle
	const hamburger = document.querySelector('.hamburger');
	const navMenu = document.querySelector('nav ul');
	
	hamburger.addEventListener('click', function() {
		this.classList.toggle('active');
		navMenu.classList.toggle('active');
	});
	
	// Close mobile menu when clicking a link
	document.querySelectorAll('nav ul li a').forEach(link => {
		link.addEventListener('click', () => {
			hamburger.classList.remove('active');
			navMenu.classList.remove('active');
		});
	});
	
	// Header scroll effect
	window.addEventListener('scroll', function() {
		const header = document.querySelector('header');
		header.classList.toggle('scrolled', window.scrollY > 50);
	});
	
	// Dark mode toggle
	const themeToggle = document.querySelector('.theme-toggle');
	const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
	const storedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	
	if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
		document.body.classList.add('theme-dark');
	}
	
	function updateThemeIcon() {
		if (!themeIcon) return;
		const isDark = document.body.classList.contains('theme-dark');
		themeIcon.classList.toggle('fa-moon', !isDark);
		themeIcon.classList.toggle('fa-sun', isDark);
	}
	
	updateThemeIcon();
	
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			document.body.classList.toggle('theme-dark');
			localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
			updateThemeIcon();
		});
	}
	
	// Animate stats counting for any numbers within a container
	function animateNumbersIn(container) {
		container.querySelectorAll('.number').forEach(stat => {
			const target = parseInt(stat.getAttribute('data-count'));
			const suffix = stat.getAttribute('data-suffix') || '';
			const duration = 2000;
			const step = target / (duration / 16);
			let current = 0;
			clearInterval(stat.__timer);
			stat.__timer = setInterval(() => {
				current += step;
				if (current >= target) {
					clearInterval(stat.__timer);
					current = target;
					stat.textContent = Math.floor(current).toLocaleString() + suffix;
				} else {
					stat.textContent = Math.floor(current).toLocaleString();
				}
			}, 16);
		});
	}

	// Observe statistic cards for repeated animations
	const statCards = document.querySelectorAll('.stat-card');
	if (statCards.length) {
		const statObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					animateNumbersIn(entry.target);
				}
			});
		}, { threshold: 0.5 });
		statCards.forEach(card => statObserver.observe(card));
	}
	
	// Animate skill bars
	const skills = document.querySelectorAll('.skill-level');
	
	function animateSkills() {
		skills.forEach(skill => {
			const level = skill.getAttribute('data-level');
			skill.style.width = level + '%';
		});
	}
	
	// Intersection Observer for animations
	const observerOptions = {
		threshold: 0.1
	};
	
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				if (entry.target.id === 'about') {
					animateSkills();
				}
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);
	
	// Observe sections for one-off animations
	const sections = document.querySelectorAll('section');
	sections.forEach(section => {
		observer.observe(section);
	});
	
	// Smooth scrolling for anchor links
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
			}
		});
	});
	
	// Toast utility
	function showToast(message) {
		const root = document.getElementById('toast-root');
		if (!root) return;
		const toast = document.createElement('div');
		toast.className = 'toast';
		toast.innerHTML = `<span class="icon">✔</span><span>${message}</span>`;
		root.appendChild(toast);
		setTimeout(() => {
			toast.style.opacity = '0';
			toast.style.transform = 'translate(-50%, -48%)';
			setTimeout(() => toast.remove(), 250);
		}, 2200);
	}

	// Update contact submission to show toast
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const submitBtn = this.querySelector('.submit-btn');
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sent ✓';
			showToast('Your message was sent');
			setTimeout(() => {
				this.reset();
				submitBtn.disabled = false;
				submitBtn.textContent = 'Send Message';
			}, 1200);
		});
	}
	
	// Newsletter form
	const newsletterForm = document.querySelector('.footer-newsletter form');
	if (newsletterForm) {
		newsletterForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const emailInput = this.querySelector('input[type="email"]');
			alert(`Thank you for subscribing with ${emailInput.value}!`);
			emailInput.value = '';
		});
	}
	
	// Scrollspy for active nav links
	const navLinks = document.querySelectorAll('nav ul li a');
	const spySections = document.querySelectorAll('main section[id]');
	if (spySections.length && navLinks.length) {
		const spy = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					navLinks.forEach(link => {
						link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
					});
				}
			});
		}, { threshold: 0.6 });
		spySections.forEach(s => spy.observe(s));
	}



	// Hero-only particles - enhanced with mouse interaction
	const heroCanvas = document.getElementById('heroParticles');
	if (heroCanvas) {
		const container = document.querySelector('.hero .container');
		let mouseX = 0, mouseY = 0;
		let isMouseInHero = false;
		
		function sizeHeroCanvas() {
			const rect = container.getBoundingClientRect();
			heroCanvas.width = rect.width;
			heroCanvas.height = rect.height;
		}
		window.addEventListener('resize', sizeHeroCanvas);
		sizeHeroCanvas();
		
		// Mouse tracking for interactive particles
		container.addEventListener('mousemove', (e) => {
			const rect = container.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			isMouseInHero = true;
		});
		
		container.addEventListener('mouseleave', () => {
			isMouseInHero = false;
		});
		
		const ctx = heroCanvas.getContext('2d');
		const particles = Array.from({ length: 40 }, () => ({
			x: Math.random() * heroCanvas.width,
			y: Math.random() * heroCanvas.height,
			r: Math.random() * 1.2 + 0.3,
			opacity: Math.random() * 0.15 + 0.05,
			dx: (Math.random() - 0.5) * 0.15,
			dy: (Math.random() - 0.5) * 0.15,
			hue: Math.random() * 60 + 250, // Purple to blue range
			saturation: Math.random() * 30 + 70,
			lightness: Math.random() * 20 + 60,
			originalR: 0,
			originalOpacity: 0
		}));
		
		// Initialize original values
		particles.forEach(p => {
			p.originalR = p.r;
			p.originalOpacity = p.opacity;
		});
		
		function step() {
			ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
			
			particles.forEach(p => {
				// Mouse interaction - particles react to mouse position
				if (isMouseInHero) {
					const dx = mouseX - p.x;
					const dy = mouseY - p.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					
					if (distance < 100) {
						// Particles near mouse get bigger and brighter
						const influence = Math.max(0, 1 - distance / 100);
						p.r = p.originalR + influence * 2;
						p.opacity = p.originalOpacity + influence * 0.3;
						
						// Gentle attraction to mouse
						p.dx += dx * 0.0001;
						p.dy += dy * 0.0001;
					} else {
						// Return to normal
						p.r = p.originalR;
						p.opacity = p.originalOpacity;
					}
				} else {
					// Return to normal when mouse leaves
					p.r = p.originalR;
					p.opacity = p.originalOpacity;
				}
				
				// Update position
				p.x += p.dx;
				p.y += p.dy;
				
				// Bounce off edges
				if (p.x < 0 || p.x > heroCanvas.width) p.dx *= -1;
				if (p.y < 0 || p.y > heroCanvas.height) p.dy *= -1;
				
				// Keep particles in bounds
				p.x = Math.max(0, Math.min(heroCanvas.width, p.x));
				p.y = Math.max(0, Math.min(heroCanvas.height, p.y));
				
				// Dampen velocity for smooth movement
				p.dx *= 0.999;
				p.dy *= 0.999;
				
				// Draw particle with subtle glow
				ctx.globalAlpha = p.opacity;
				ctx.fillStyle = `hsl(${p.hue}, ${p.saturation}%, ${p.lightness}%)`;
				
				// Add subtle glow effect
				ctx.shadowColor = `hsl(${p.hue}, ${p.saturation}%, ${p.lightness}%)`;
				ctx.shadowBlur = 8;
				
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
				
				// Reset shadow
				ctx.shadowBlur = 0;
			});
			
			ctx.globalAlpha = 1;
			requestAnimationFrame(step);
		}
		
		requestAnimationFrame(step);
	}
});