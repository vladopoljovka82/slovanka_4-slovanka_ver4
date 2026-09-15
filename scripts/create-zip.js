import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function generateWebsiteZip() {
  const zip = new JSZip();

  // Load the standalone index.html content
  const standaloneHtmlPath = path.resolve('public/standalone.html');
  if (fs.existsSync(standaloneHtmlPath)) {
    const htmlContent = fs.readFileSync(standaloneHtmlPath, 'utf-8');
    zip.file('index.html', htmlContent);
  }

  // Add the 10 images
  for (let i = 1; i <= 10; i++) {
    const imgName = `slika${i}.jpg`;
    const imgPath = path.resolve('public', imgName);
    if (fs.existsSync(imgPath)) {
      const imgBuffer = fs.readFileSync(imgPath);
      zip.file(imgName, imgBuffer);
    }
  }

  // Add the cocktail images
  for (let i = 1; i <= 4; i++) {
    const imgName = `koktel${i}.jpg`;
    const imgPath = path.resolve('public', imgName);
    if (fs.existsSync(imgPath)) {
      const imgBuffer = fs.readFileSync(imgPath);
      zip.file(imgName, imgBuffer);
    }
  }

  // Add instruction file
  const readmeContent = `SLOVANKA CAFFE PIZZERIA - VEB SAJT (SELENČA)
==============================================
Ovaj folder sadrži kompletan gotov sajt za Slovanka Caffe Pizzeria (Selenča, M. Tita 165):

Sadržaj:
1. index.html - Glavna stranica sajta (otvorite dvoklikom u bilo kom pregledaču: Chrome, Firefox, Safari, Edge)
2. slika1.jpg do slika10.jpg - Sve fotografije lokala, letnje terase, enterijera, pica i kafe
3. koktel1.jpg do koktel4.jpg - Slike koktela (Virgin Mojito, Safe Spritz, Berry Smash, Tropical Passion)
4. meni.pdf - PDF jelovnik

Funkcionalnosti:
- Bento galerija fotografija ambijenta i lokala (10 slika)
- Jelovnik sa pica, kobasicama, kafom i napicima
- Sistem komentara: gosti šalju komentar na odobrenje (na info@slovankacaffe.com).
- Moderacija komentara: administrator jednim klikom odobrava komentar putem linka u mejlu ili preko administratorskog panela (PIN: 1234).

Kako pokrenuti ili postaviti:
- Lokalno: Dovoljno je da dvokliknete na "index.html" i sajt se odmah otvara sa svim slikama i funkcijama!
- Na hostingu: Sve ove fajlove jednostavno prebacite u "public_html" (ili root folder) vašeg hostinga ili domena.

Slovanka Caffe Pizzeria | M. Tita 165, 21425 Selenča | +381 (0) 21 774 012 | info@slovankacaffe.com
`;
  zip.file('UPUTSTVO.txt', readmeContent);

  // Generate zip file
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  const outPath = path.resolve('public/slovanka-caffe-pizzeria.zip');
  fs.writeFileSync(outPath, content);
  console.log(`Successfully generated: ${outPath} (${(content.length / 1024 / 1024).toFixed(2)} MB)`);

  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    const distOut = path.resolve('dist/slovanka-caffe-pizzeria.zip');
    fs.writeFileSync(distOut, content);
    console.log(`Copied to: ${distOut}`);
  }
}

generateWebsiteZip().catch(console.error);
