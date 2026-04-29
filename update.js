const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/james/.gemini/antigravity/scratch/anchorpoint-solutions';
const destDir = 'c:/Users/james/.gemini/antigravity/scratch/smart-promollc';

// 1. Remove 15 years and 250M from index.html
let indexHtml = fs.readFileSync(path.join(destDir, 'index.html'), 'utf8');
const statGridRegex = /<div class="stat-grid">[\s\S]*?<\/div>\s*<br>/;
indexHtml = indexHtml.replace(statGridRegex, '');

// 2. Add payment cards to all html files
const htmlFiles = ['index.html', 'about.html', 'contact.html', 'services.html', 'privacy-policy.html', 'refund-policy.html', 'terms-and-conditions.html'];

const paymentCardsHtml = `
          <div class="payment-methods" style="margin-top: 20px;">
            <h4 style="margin-bottom: 10px; font-size: 14px; color: white;">We Accept:</h4>
            <div class="payment-icons" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <img src="images/visa.svg" alt="Visa" class="payment-icon" title="Visa" style="height: 24px;" />
              <img src="images/mastercard.svg" alt="Mastercard" class="payment-icon" title="Mastercard" style="height: 24px;" />
              <img src="images/amex.svg" alt="American Express" class="payment-icon" title="American Express" style="height: 24px;" />
              <img src="images/discover.svg" alt="Discover" class="payment-icon" title="Discover" style="height: 24px;" />
              <img src="images/bank-transfer.svg" alt="Bank Transfer" class="payment-icon" title="Bank Transfer" style="height: 24px;" />
            </div>
          </div>`;

function injectPaymentCards(html) {
    const targetText = 'ensuring long-term fiscal stability.</p>';
    if (html.includes(targetText) && !html.includes('payment-methods')) {
        return html.replace(targetText, targetText + paymentCardsHtml);
    }
    return html;
}

indexHtml = injectPaymentCards(indexHtml);
fs.writeFileSync(path.join(destDir, 'index.html'), indexHtml);

htmlFiles.forEach(file => {
    if (file !== 'index.html') {
        let html = fs.readFileSync(path.join(destDir, file), 'utf8');
        html = injectPaymentCards(html);
        fs.writeFileSync(path.join(destDir, file), html);
    }
});

// 3. Update legal policies
const policyFiles = ['privacy-policy.html', 'terms-and-conditions.html', 'refund-policy.html'];

policyFiles.forEach(file => {
    const srcHtml = fs.readFileSync(path.join(srcDir, file), 'utf8');
    let destHtml = fs.readFileSync(path.join(destDir, file), 'utf8');

    // Extract legal-content from src
    const match = srcHtml.match(/<section class="legal-content">[\s\S]*?<div class="container">([\s\S]*?)<\/div>\s*<\/section>/);
    if (match) {
        let content = match[1];
        
        // Replace company specific details
        content = content.replace(/Anchorpoint Solutions/g, 'Smart Promo LLC');
        content = content.replace(/\+1 \(929\) 755 3786/g, '+1 (713) 226-9651');
        content = content.replace(/info@anchorpoint-solutions\.us/g, 'info@smart-promollc.us');
        content = content.replace(/anchorpoint-solutions\.us/g, 'smart-promollc.us');
        content = content.replace(/Anchorpoint/g, 'Smart Promo LLC');

        // Now replace in destHtml
        destHtml = destHtml.replace(/<div class="legal-content">([\s\S]*?)<\/div>/, '<div class="legal-content">\n' + content + '\n      </div>');
        fs.writeFileSync(path.join(destDir, file), destHtml);
    }
});
console.log('Update complete.');
