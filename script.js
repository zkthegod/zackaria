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

	// Particles background (very light)
	const canvas = document.getElementById('bgParticles');
	if (canvas) {
		const ctx = canvas.getContext('2d');
		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		window.addEventListener('resize', resize);
		resize();
		const particles = Array.from({ length: 40 }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			r: Math.random() * 1.6 + 0.4,
			opacity: Math.random() * 0.35 + 0.15,
			dx: (Math.random() - 0.5) * 0.2,
			dy: (Math.random() - 0.5) * 0.2,
		}));
		function step() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#a855f7';
			particles.forEach(p => {
				p.x += p.dx; p.y += p.dy;
				if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
				if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
				ctx.globalAlpha = p.opacity;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			});
			ctx.globalAlpha = 1;
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}
});