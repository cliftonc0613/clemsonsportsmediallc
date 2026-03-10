# Brand Contact Page to Clemson Sports Media

## Plan
- [x] Step 1: Replace generic Hero with custom Clemson-branded hero in `contact/page.tsx`
- [x] Step 2: Update contact info cards with Clemson colors and real info
- [x] Step 3: Update form section heading color
- [x] Step 4: Update submit button and privacy link colors in `ContactForm.tsx`
- [x] Step 5: Verify build passes

## Review

### Files Modified (2)
- `frontend/app/contact/page.tsx` — Replaced generic `<Hero>` with inline dark purple hero section (white text, orange accent bar, sports media copy). Updated all 3 contact cards: icon circles now orange-tinted, card headings purple, placeholder info replaced with Clemson-relevant details (Clemson phone, cusportsmedia email, Clemson University address). Form heading changed from neutral-800 to Clemson purple.
- `frontend/components/ContactForm.tsx` — Submit button changed from neutral-900 to Clemson orange. Privacy link changed to Clemson purple with orange hover.

### Summary
Rebranded the entire /contact page from generic neutral styling to Clemson Sports Media's visual identity. Hero uses dark purple background with orange accent bar. Contact cards use orange icons and purple headings. Form button is Clemson orange. All changes are CSS class swaps and content updates — no structural or logic changes.
