# ACF Field Setup Documentation

This document outlines the ACF (Advanced Custom Fields) structure for making page content editable through WordPress.

---

## Homepage (`/`)

**WordPress Page:** "Home" (set as front page)

### Hero Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `hero_title` | Text | "Transform Your Business with Expert Services" |
| `hero_subtitle` | Textarea | "We help service-based businesses grow..." |
| `hero_primary_cta_text` | Text | "Get Started" |
| `hero_primary_cta_link` | URL | "/contact" |
| `hero_secondary_cta_text` | Text | "Our Services" |
| `hero_secondary_cta_link` | URL | "/services" |

### Services Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `services_title` | Text | "Our Services" |
| `services_subtitle` | Textarea | "Comprehensive solutions tailored to your business needs" |
| `services_cta_text` | Text | "View All Services" |

### Testimonials Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `testimonials_title` | Text | "What Our Clients Say" |
| `testimonials_subtitle` | Textarea | "Don't just take our word for it" |
| `testimonials_cta_text` | Text | "View All Testimonials" |

### Blog Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `blog_title` | Text | "Latest from the Blog" |
| `blog_subtitle` | Textarea | "Insights and updates from our team" |
| `blog_cta_text` | Text | "View All Posts" |

### CTA Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `cta_title` | Text | "Ready to Get Started?" |
| `cta_subtitle` | Textarea | "Contact us today and let's discuss..." |
| `cta_primary_text` | Text | "Contact Us" |
| `cta_primary_link` | URL | "/contact" |
| `cta_secondary_text` | Text | "Learn More" |
| `cta_secondary_link` | URL | "/services" |

---

## Contact Page (`/contact`)

**WordPress Page:** "Contact"

### Hero Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `hero_title` | Text | "Contact Us" |
| `hero_subtitle` | Textarea | "Have a question or want to work together?" |

### Contact Info
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `email` | Email | "hello@example.com" |
| `phone` | Text | "(123) 456-7890" |
| `address_line_1` | Text | "123 Main Street" |
| `address_line_2` | Text | "City, State 12345" |
| `hours_weekday` | Text | "Monday - Friday: 9am - 5pm" |
| `hours_weekend` | Text | "Saturday - Sunday: Closed" |

---

## Services Page (`/services`)

**WordPress Page:** "Services"

### Hero Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `hero_title` | Text | "Our Services" |
| `hero_subtitle` | Textarea | "Comprehensive solutions tailored to your business needs..." |
| `hero_cta_text` | Text | "Get a Quote" |
| `hero_cta_link` | URL | "/contact" |

### CTA Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `cta_title` | Text | "Not Sure Which Service is Right for You?" |
| `cta_subtitle` | Textarea | "Let's have a conversation about your needs and goals." |
| `cta_button_text` | Text | "Schedule a Consultation" |

---

## Testimonials Page (`/testimonials`)

**WordPress Page:** "Testimonials"

### Hero Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `hero_title` | Text | "Client Testimonials" |
| `hero_subtitle` | Textarea | "Don't just take our word for it..." |

### CTA Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `cta_title` | Text | "Ready to Be Our Next Success Story?" |
| `cta_subtitle` | Textarea | "Join our growing list of satisfied clients..." |
| `cta_button_text` | Text | "Start Your Journey" |

---

## Blog Page (`/blog`)

**WordPress Page:** "Blog"

### Hero Section
| Field Name | Field Type | Description |
|------------|------------|-------------|
| `hero_title` | Text | "Our Blog" |
| `hero_subtitle` | Textarea | "Insights, updates, and resources..." |

---

## Global Settings (ACF Options Page)

For site-wide settings, create an ACF Options Page:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `site_name` | Text | Site name for SEO/schema |
| `site_description` | Textarea | Default meta description |
| `social_twitter` | URL | Twitter profile URL |
| `social_linkedin` | URL | LinkedIn profile URL |
| `social_facebook` | URL | Facebook profile URL |
| `social_instagram` | URL | Instagram profile URL |

---

## Implementation Order

1. **Style pages first** - Design and style each page in Next.js
2. **Create ACF field groups** - Set up fields in WordPress for each page
3. **Update Next.js pages** - Fetch content from `getPage()` instead of hardcoding
4. **Test revalidation** - Ensure content updates trigger ISR

---

## Next.js Integration Example

Once ACF fields are created, update Next.js pages like this:

```typescript
// Example: Homepage
const homePage = await getPage('home');
const acf = homePage?.acf;

<Hero
  title={acf?.hero_title || "Default Title"}
  subtitle={acf?.hero_subtitle || "Default subtitle"}
  primaryCta={{
    text: acf?.hero_primary_cta_text || "Get Started",
    href: acf?.hero_primary_cta_link || "/contact"
  }}
/>
```
