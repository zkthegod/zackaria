document.addEventListener('DOMContentLoaded', function() {
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
	
	// Animate stats counting
	const stats = document.querySelectorAll('.stat .number, .stat-card .number');
	
	function animateStats() {
		stats.forEach(stat => {
			const target = parseInt(stat.getAttribute('data-count'));
			const suffix = stat.getAttribute('data-suffix') || '';
			const duration = 2000; // 2 seconds
			const step = target / (duration / 16); // ~60fps
			
			let current = 0;
			const timer = setInterval(() => {
				current += step;
				if (current >= target) {
					clearInterval(timer);
					current = target;
					stat.textContent = Math.floor(current).toLocaleString() + suffix;
				} else {
					stat.textContent = Math.floor(current).toLocaleString();
				}
			}, 16);
		});
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
				if (entry.target.id === 'about' || entry.target.id === 'statistics') {
					animateStats();
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
	
	// Form submission
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', function(e) {
			e.preventDefault();
			alert('Thank you for your message! I will get back to you soon.');
			this.reset();
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
});