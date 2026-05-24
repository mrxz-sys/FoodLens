/* ═══════════════════════════════════════════
   FoodLens — app.js
   Open Food Facts barcode analyser
   Français / العربية / دارجة
═══════════════════════════════════════════ */

'use strict';

/* ── i18n ── */
const LANGS = {
  en: {
    labelScan: 'Barcode',
    scanBtn:   'Analyze',
    labelTry:  'Try :',
    emptyTitle:'Scan a product',
    emptySub:  'Enter a barcode to get a complete analysis in seconds.',
    verdict:   { good:'✅ Good choice', ok:'⚠️ Acceptable', bad:'❌ Avoid' },
    sections:  { nutrition:'Nutritional values (per 100g)', warnings:'Alerts & Restrictions', ingredients:'Ingredients', alternative:'Best alternative' },
    warnings: {
      halal:        ['🚫 Non-Halal detected',    'This product may contain pork or alcohol.'],
      gluten:       ['🌾 Contains Gluten',       'Not suitable for celiac people.'],
      lactose:      ['🥛 Contains Lactose',      'May cause discomfort for those intolerant.'],
      pork:         ['🐷 Pork derivatives',      'Gelatin or pork animal fats detected.'],
      ultra:        ['⚠️ Ultra-processed (NOVA 4)', 'Additives, preservatives and artificial flavors.'],
      ok_halal:     ['✅ Probably Halal',        'No pork or alcohol ingredients detected.'],
      high_sodium:  ['🧂 High salt',             'High salt content, consume in moderation.'],
      high_satfat:  ['🧈 Saturated fats',        'High level of saturated fatty acids.'],
      high_additive:['🧪 Many additives',        'Colorings, preservatives or sweeteners detected.'],
      low_calorie:  ['💧 Very low calorie',      'This product provides almost no energy.'],
    },
    nutrients: { energy:'Energy', sugars:'Sugars', fat:'Fat', salt:'Salt', proteins:'Proteins', fiber:'Fiber', satfat:'Saturated fat' },
    reasons: {
      high_sugar:   (v) => `Too sugary — ${v.toFixed(1)} g sugars/100g`,
      high_fat:     (v) => `Too fatty — ${v.toFixed(1)} g fat/100g`,
      high_satfat:  (v) => `High saturated fats — ${v.toFixed(1)} g/100g`,
      high_salt:    (v) => `Too salty — ${v.toFixed(1)} g salt/100g`,
      ultra:        ()  => 'Ultra-processed food (NOVA 4)',
      good_prot:    (v) => `Good source of protein — ${v.toFixed(1)} g/100g`,
      balanced:     ()  => 'Balanced nutritional profile',
      low_calorie:  ()  => 'Very low calorie product (water, light sauce…)',
      default:      ()  => 'Check details below',
    },
    alt_title:       'Best alternative',
    alt_best_label:  '✅ Best choice',
    alt_others:      '📋 Other options',
    alt_loading:     'Searching…',
    alt_none:        '⚠️ No alternative found — choose unprocessed foods.',
    alt_already_best:'✅ This is the best choice available. Keep it up!',
    alt_bad_no_alt:  '📋 No alternative found in this category. Check the nutritional details above.',
    alt_top_count:   (n) => `Top ${n} alternatives`,
    not_found:    'Product not found.\nCheck the barcode or try another product.',
    net_error:    'Network error — check your connection.',
    nova_labels:  ['', 'Unprocessed', 'Culinary ingredients', 'Processed', 'Ultra-processed'],
    share_title:  'Share this product',
    share_sub:    'Scan to analyze this product',
    share_copy:   'Copy',
    share_copied: '✓ Copied!',
    dir: 'ltr',
    sections_extra: { product_info: 'Product information', eco: 'Environmental impact' },
    labels: {
      quantity:    'Quantity',
      packaging:   'Packaging',
      origin:      'Origin',
      countries:   'Sold in',
      triman:      'Triman',
      triman_yes:  '♻️ Recyclable (Triman)',
      triman_no:   'No Triman label',
      green_score: 'Green-Score',
      carbon:      'Carbon footprint',
      carbon_unit: 'g CO₂ eq. / kg',
      unknown:     'Not specified',
    },
    green_labels: ['', 'A — Very low impact', 'B — Low impact', 'C — Moderate impact', 'D — High impact', 'E — Very high impact'],
    compare: {
      tab:       'Compare',
      analyze:   'Analyze',
      labelA:    'Product A',
      labelB:    'Product B',
      btn:       '⚖️ Compare',
      title:     'Side-by-side comparison',
      winner:    '🏆 Better choice',
      tie:       '🤝 Tie',
      perHundred:'per 100g',
      viewFull:  'Full analysis',
      noData:    'No data',
    },
  },
  fr: {
    labelScan: 'Code-barres',
    scanBtn:   'Analyser',
    labelTry:  'Essayer :',
    emptyTitle:'Scannez un produit',
    emptySub:  'Entrez un code-barres pour obtenir une analyse complète en secondes.',
    verdict:   { good:'✅ Bon choix', ok:'⚠️ Acceptable', bad:'❌ À éviter' },
    sections:  { nutrition:'Valeurs nutritionnelles (pour 100 g)', warnings:'Alertes & Restrictions', ingredients:'Ingrédients', alternative:'Meilleure alternative' },
    warnings: {
      halal:        ['🚫 Non Halal détecté',    'Ce produit peut contenir du porc ou de l\'alcool.'],
      gluten:       ['🌾 Contient du Gluten',   'Non adapté aux personnes cœliaques.'],
      lactose:      ['🥛 Contient du Lactose',  'Peut provoquer des inconforts chez les intolérants.'],
      pork:         ['🐷 Dérivés de porc',      'Gélatine ou graisses animales porcines détectées.'],
      ultra:        ['⚠️ Ultra-transformé (NOVA 4)', 'Additifs, conservateurs et arômes artificiels.'],
      ok_halal:     ['✅ Probablement Halal',   'Aucun ingrédient porcin ou alcool détecté.'],
      high_sodium:  ['🧂 Très salé',            'Teneur en sel élevée, à consommer avec modération.'],
      high_satfat:  ['🧈 Graisses saturées',    'Taux élevé d\'acides gras saturés.'],
      high_additive:['🧪 Nombreux additifs',    'Colorants, conservateurs ou édulcorants détectés.'],
      low_calorie:  ['💧 Très peu calorique',   'Ce produit n\'apporte quasiment pas d\'énergie.'],
    },
    nutrients: { energy:'Énergie', sugars:'Sucres', fat:'Lipides', salt:'Sel', proteins:'Protéines', fiber:'Fibres', satfat:'Graisses sat.' },
    reasons: {
      high_sugar:   (v) => `Trop sucré — ${v.toFixed(1)} g de sucres/100 g`,
      high_fat:     (v) => `Trop gras — ${v.toFixed(1)} g de lipides/100 g`,
      high_satfat:  (v) => `Graisses saturées élevées — ${v.toFixed(1)} g/100 g`,
      high_salt:    (v) => `Trop salé — ${v.toFixed(1)} g de sel/100 g`,
      ultra:        ()  => 'Aliment ultra-transformé (NOVA 4)',
      good_prot:    (v) => `Bonne source de protéines — ${v.toFixed(1)} g/100 g`,
      balanced:     ()  => 'Profil nutritionnel équilibré',
      low_calorie:  ()  => 'Produit très peu calorique (eau, sauce légère…)',
      default:      ()  => 'Vérifiez les détails ci-dessous',
    },
    alt_title:       'Meilleure alternative',
    alt_best_label:  '✅ Meilleur choix',
    alt_others:      '📋 Autres options',
    alt_loading:     'Recherche en cours…',
    alt_none:        '⚠️ Aucune alternative trouvée — privilégiez les aliments non transformés.',
    alt_already_best:'✅ C\'est le meilleur choix disponible. Continuez !',
    alt_bad_no_alt: '📋 Aucune alternative trouvée dans cette catégorie. Consultez les détails nutritionnels ci-dessus.',
    alt_top_count:   (n) => `Top ${n} alternatives`,
    not_found:    'Produit introuvable.\nVérifiez le code-barres ou essayez un autre produit.',
    net_error:    'Erreur réseau — vérifiez votre connexion.',
    nova_labels:  ['', 'Peu transformé', 'Ingrédients culinaires', 'Transformé', 'Ultra-transformé'],
    share_title:  'Partager ce produit',
    share_sub:    'Scannez pour analyser ce produit',
    share_copy:   'Copier',
    share_copied: '✓ Copié !',
    dir: 'ltr',
    sections_extra: { product_info: 'Informations produit', eco: 'Impact environnemental' },
    labels: {
      quantity:    'Quantité',
      packaging:   'Emballage',
      origin:      'Origine',
      countries:   'Vendu en',
      triman:      'Triman',
      triman_yes:  '♻️ Recyclable (Triman)',
      triman_no:   'Pas de label Triman',
      green_score: 'Green-Score',
      carbon:      'Empreinte carbone',
      carbon_unit: 'g CO₂ éq. / kg',
      unknown:     'Non renseigné',
    },
    green_labels: ['', 'A — Très faible impact', 'B — Faible impact', 'C — Impact modéré', 'D — Impact élevé', 'E — Très fort impact'],
    compare: {
      tab:       'Comparer',
      analyze:   'Analyser',
      labelA:    'Produit A',
      labelB:    'Produit B',
      btn:       '⚖️ Comparer',
      title:     'Comparaison côte à côte',
      winner:    '🏆 Meilleur choix',
      tie:       '🤝 Égalité',
      perHundred:'pour 100 g',
      viewFull:  'Analyse complète',
      noData:    'N/A',
    },
  },
  ar: {
    labelScan: 'الباركود',
    scanBtn:   'تحليل',
    labelTry:  'جرّب :',
    emptyTitle:'امسح منتجاً',
    emptySub:  'أدخل الباركود للحصول على تحليل كامل في ثوانٍ.',
    verdict:   { good:'✅ اختيار جيد', ok:'⚠️ مقبول', bad:'❌ تجنّبه' },
    sections:  { nutrition:'القيم الغذائية (لكل 100 غ)', warnings:'تحذيرات وقيود', ingredients:'المكونات', alternative:'بديل أفضل' },
    warnings: {
      halal:        ['🚫 غير حلال',        'قد يحتوي على لحم الخنزير أو الكحول.'],
      gluten:       ['🌾 يحتوي على الغلوتين','غير مناسب لمرضى الداء البطني.'],
      lactose:      ['🥛 يحتوي على اللاكتوز','قد يسبب عسراً هضمياً للحساسين.'],
      pork:         ['🐷 مشتقات الخنزير',  'تم الكشف عن جيلاتين أو دهون خنزير.'],
      ultra:        ['⚠️ معالج بشدة (NOVA 4)','يحتوي على مضافات وأصباغ صناعية.'],
      ok_halal:     ['✅ على الأرجح حلال', 'لم يتم الكشف عن مكونات خنزير أو كحول.'],
      high_sodium:  ['🧂 ملح مرتفع',       'محتوى ملح عالٍ، يُنصح بالاعتدال.'],
      high_satfat:  ['🧈 دهون مشبعة',      'نسبة عالية من الأحماض الدهنية المشبعة.'],
      high_additive:['🧪 مضافات كثيرة',    'ملونات أو حوافظ أو محليات صناعية.'],
      low_calorie:  ['💧 منخفض السعرات',   'هذا المنتج يكاد لا يحتوي على طاقة.'],
    },
    nutrients: { energy:'طاقة', sugars:'سكريات', fat:'دهون', salt:'ملح', proteins:'بروتين', fiber:'ألياف', satfat:'دهون مشبعة' },
    reasons: {
      high_sugar:   (v) => `سكر مرتفع — ${v.toFixed(1)} غ/100 غ`,
      high_fat:     (v) => `دهون مرتفعة — ${v.toFixed(1)} غ/100 غ`,
      high_satfat:  (v) => `دهون مشبعة — ${v.toFixed(1)} غ/100 غ`,
      high_salt:    (v) => `ملح زائد — ${v.toFixed(1)} غ/100 غ`,
      ultra:        ()  => 'غذاء مُعالَج بشدة (NOVA 4)',
      good_prot:    (v) => `غني بالبروتين — ${v.toFixed(1)} غ/100 غ`,
      balanced:     ()  => 'قيم غذائية متوازنة',
      low_calorie:  ()  => 'منتج منخفض السعرات جداً (ماء، صلصة خفيفة…)',
      default:      ()  => 'راجع التفاصيل أدناه',
    },
    alt_title:       'أفضل بديل',
    alt_best_label:  '✅ الخيار الأفضل',
    alt_others:      '📋 خيارات أخرى',
    alt_loading:     'جارٍ البحث…',
    alt_none:        '⚠️ لا يوجد بديل — يُنصح باختيار أغذية طبيعية غير مصنّعة.',
    alt_already_best:'✅ هذا هو الخيار الأفضل المتاح. استمر في شرائه!',
    alt_bad_no_alt: '📋 لم يتم العثور على بديل في هذه الفئة. راجع التفاصيل الغذائية أعلاه.',
    alt_top_count:   (n) => `أفضل ${n} بدائل`,
    not_found:    'المنتج غير موجود.\nتحقق من الباركود أو جرّب منتجاً آخر.',
    net_error:    'خطأ في الشبكة — تحقق من اتصالك.',
    nova_labels:  ['', 'طبيعي', 'مكونات طهي', 'مُعالَج', 'مُعالَج بشدة'],
    share_title:  'مشاركة المنتج',
    share_sub:    'امسح للتحليل',
    share_copy:   'نسخ',
    share_copied: '✓ تم النسخ!',
    dir: 'rtl',
    sections_extra: { product_info: 'معلومات المنتج', eco: 'الأثر البيئي' },
    labels: {
      quantity:    'الكمية',
      packaging:   'التغليف',
      origin:      'المنشأ',
      countries:   'يُباع في',
      triman:      'Triman',
      triman_yes:  '♻️ قابل لإعادة التدوير (Triman)',
      triman_no:   'لا يوجد ختم Triman',
      green_score: 'Green-Score',
      carbon:      'البصمة الكربونية',
      carbon_unit: 'غ CO₂ / كغ',
      unknown:     'غير محدد',
    },
    green_labels: ['', 'A — تأثير منخفض جداً', 'B — تأثير منخفض', 'C — تأثير معتدل', 'D — تأثير عالٍ', 'E — تأثير عالٍ جداً'],
    compare: {
      tab:       'مقارنة',
      analyze:   'تحليل',
      labelA:    'منتج أ',
      labelB:    'منتج ب',
      btn:       '⚖️ مقارنة',
      title:     'مقارنة جانبية',
      winner:    '🏆 الخيار الأفضل',
      tie:       '🤝 تعادل',
      perHundred:'لكل 100 غ',
      viewFull:  'تحليل كامل',
      noData:    'غير متاح',
    },
  },
  dr: {
    labelScan: 'الباركود',
    scanBtn:   'حلّل',
    labelTry:  'جرّب :',
    emptyTitle:'سكان شي منتوج',
    emptySub:  'دخل الباركود باش تشوف التحليل الكامل ف ثواني.',
    verdict:   { good:'✅ خيار مزيان', ok:'⚠️ مقبول', bad:'❌ خليه' },
    sections:  { nutrition:'القيم الغذائية (ل 100 غ)', warnings:'تحذيرات وقيود', ingredients:'المكونات', alternative:'بديل أحسن' },
    warnings: {
      halal:        ['🚫 مشي حلال',      'ممكن فيه خنزير ولا كحول.'],
      gluten:       ['🌾 فيه جلوتين',    'مشي مناسب لمن عندهم حساسية.'],
      lactose:      ['🥛 فيه لاكتوز',    'ممكن يولد مشاكل لي عندهم عدم تحمل.'],
      pork:         ['🐷 فيه خنزير',     'كاين جيلاتين ولا دهون الخنزير.'],
      ultra:        ['⚠️ مصنّع بزاف (NOVA 4)','فيه ملونات وحوافظ ومواد صناعية.'],
      ok_halal:     ['✅ غالباً حلال',   'ما تلقاوش خنزير ولا كحول.'],
      high_sodium:  ['🧂 فيه ملح بزاف', 'كمية الملح عالية، خودها بالقدر.'],
      high_satfat:  ['🧈 دهون مشبعة',   'نسبة عالية من الدهون المشبعة.'],
      high_additive:['🧪 فيه مضافات',   'ملونات ولا حوافظ ولا محليات صناعية.'],
      low_calorie:  ['💧 سعرات قليلة',  'هاد المنتوج ما فيهش تقريباً شي طاقة.'],
    },
    nutrients: { energy:'طاقة', sugars:'سكر', fat:'دهون', salt:'ملح', proteins:'بروتين', fiber:'ألياف', satfat:'دهون مشبعة' },
    reasons: {
      high_sugar:   (v) => `فيه سكر بزاف — ${v.toFixed(1)} غ/100 غ`,
      high_fat:     (v) => `فيه دهون بزاف — ${v.toFixed(1)} غ/100 غ`,
      high_satfat:  (v) => `دهون مشبعة — ${v.toFixed(1)} غ/100 غ`,
      high_salt:    (v) => `فيه ملح بزاف — ${v.toFixed(1)} غ/100 غ`,
      ultra:        ()  => 'منتوج مصنّع بزاف (NOVA 4)',
      good_prot:    (v) => `غني بالبروتين — ${v.toFixed(1)} غ/100 غ`,
      balanced:     ()  => 'قيم غذائية متوازنة',
      low_calorie:  ()  => 'منتوج ما فيهش سعرات (ماء، صلصة خفيفة…)',
      default:      ()  => 'شوف التفاصيل من تحت',
    },
    alt_title:       'أحسن بديل',
    alt_best_label:  '✅ الخيار الأحسن',
    alt_others:      '📋 خيارات أخرى',
    alt_loading:     'كيقلّب…',
    alt_none:        '⚠️ ما لقاو شي بديل — خير تاكل حوايج طبيعية.',
    alt_already_best:'✅ هاد المنتوج هو الأحسن الموجود. زيد شريه!',
    alt_bad_no_alt: '📋 ما لقيناش بديل فهاد الفئة. شوف التفاصيل الغذائية من فوق.',
    alt_top_count:   (n) => `أحسن ${n} بدائل`,
    not_found:    'ما تلقيناشه.\nتأكد من الباركود ولا جرب منتوج آخر.',
    net_error:    'خطأ ف الاتصال — تحقق من النت ديالك.',
    nova_labels:  ['', 'طبيعي', 'مكونات الطبخ', 'مصنّع', 'مصنّع بزاف'],
    share_title:  'شارك المنتوج',
    share_sub:    'سكان باش تحلل',
    share_copy:   'نسخ',
    share_copied: '✓ تنسخ!',
    dir: 'rtl',
    sections_extra: { product_info: 'معلومات المنتوج', eco: 'التأثير البيئي' },
    labels: {
      quantity:    'الكمية',
      packaging:   'التغليف',
      origin:      'الأصل',
      countries:   'يتباع في',
      triman:      'Triman',
      triman_yes:  '♻️ قابل للتدوير (Triman)',
      triman_no:   'ما كاينش ختم Triman',
      green_score: 'Green-Score',
      carbon:      'البصمة الكربونية',
      carbon_unit: 'غ CO₂ / كغ',
      unknown:     'ما معروفش',
    },
    green_labels: ['', 'A — تأثير خفيف بزاف', 'B — تأثير خفيف', 'C — تأثير معتدل', 'D — تأثير عالي', 'E — تأثير عالي بزاف'],
    compare: {
      tab:       'قارن',
      analyze:   'حلّل',
      labelA:    'منتوج أ',
      labelB:    'منتوج ب',
      btn:       '⚖️ قارن',
      title:     'مقارنة جنب لجنب',
      winner:    '🏆 الأحسن',
      tie:       '🤝 مساواة',
      perHundred:'ل 100 غ',
      viewFull:  'تحليل كامل',
      noData:    'ما كاينش',
    },
  },
};

let lang = 'fr';
let lastProduct = null;
const OFF = barcode =>
  `https://corsproxy.io/?url=${encodeURIComponent(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)}`;
const OFF_SEARCH = url =>
  `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
const productCache = new Map();
/* ── Helpers ── */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function setLang(l) {
  lang = l;
  const L = LANGS[l];
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  document.documentElement.setAttribute('dir', L.dir);
  $('labelScan').textContent       = L.labelScan;
  $('scanBtnText').textContent     = L.scanBtn;
  $('labelTry').textContent        = L.labelTry;
  $('emptyTitle').textContent      = L.emptyTitle;
  $('emptySub').textContent        = L.emptySub;
  $('tabSingleLabel').textContent  = L.compare.analyze;
  $('tabCompareLabel').textContent = L.compare.tab;
  $('labelA').textContent          = L.compare.labelA;
  $('labelB').textContent          = L.compare.labelB;
  $('compareBtnText').textContent  = L.compare.btn;
  if (lastProduct) renderProduct(lastProduct);
}

/* ── Scan ── */
async function handleScan() {
  const barcode = $('barcodeInput').value.trim().replace(/\s/g, '');
  if (!barcode) return;

  const loadingBar = $('loadingBar');
  const btn        = $('scanBtn');
  const spinner    = $('spinner');
  const scanText   = $('scanBtnText');
  const resultArea = $('resultArea');
  const emptyState = $('emptyState');

  loadingBar.classList.add('active');
  btn.disabled = true;
  spinner.classList.add('active');
  scanText.classList.add('scan-btn-text-hidden');
  emptyState.classList.add('empty-state-hidden');
  resultArea.classList.remove('visible');
  resultArea.innerHTML = '';

  try {
    const barcode2 = $('barcodeInput').value.trim().replace(/\s/g, '');
    let product = productCache.get(barcode2);
    if (!product) {
const res = await fetch(OFF(barcode2), { signal: AbortSignal.timeout(10000) });
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 1500));
const res2 = await fetch(OFF(barcode2), { signal: AbortSignal.timeout(10000) });
        if (!res2.ok) throw new Error('HTTP ' + res2.status);
        const data2 = await res2.json();
        if (data2.status !== 1 || !data2.product) { showError(LANGS[lang].not_found); return; }
        product = data2.product;
      } else {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (data.status !== 1 || !data.product) { showError(LANGS[lang].not_found); return; }
        product = data.product;
      }
      productCache.set(barcode2, product);
    }
    lastProduct = product;
    renderProduct(product);
  } catch (e) {
    showError(e.name === 'TimeoutError' ? LANGS[lang].net_error : LANGS[lang].not_found);
  } finally {
    loadingBar.classList.remove('active');
    btn.disabled = false;
    spinner.classList.remove('active');
    scanText.classList.remove('scan-btn-text-hidden');
  }
}

/* ── Error ── */
function showError(msg) {
  const resultArea = $('resultArea');
  resultArea.innerHTML = `<div class="error-card">${esc(msg).replace(/\n/g, '<br>')}</div>`;
  resultArea.classList.add('visible');
}

/* ══════════════════════════════════════════════
   VERDICT ENGINE
══════════════════════════════════════════════ */
function computeVerdict(p) {
  const nutr    = p.nutriments || {};
  const nutri   = (p.nutriscore_grade || '').toUpperCase();
  const nova    = parseInt(p.nova_group) || 0;
  const ingr    = (p.ingredients_text || '').toLowerCase();

  const energy   = nutr['energy-kcal_100g'] ?? (nutr.energy_100g ? nutr.energy_100g / 4.184 : undefined);
  const sugar    = nutr.sugars_100g;
  const fat      = nutr.fat_100g;
  const satfat   = nutr['saturated-fat_100g'];
  const salt     = nutr.salt_100g;
  const sodium   = nutr.sodium_100g ?? (salt !== undefined ? salt / 2.5 : undefined);
  const proteins = nutr.proteins_100g;
  const fiber    = nutr.fiber_100g;

  const totalNutrients = [sugar, fat, proteins].filter(v => v !== undefined);
  const sumNutrients   = totalNutrients.reduce((a, b) => a + b, 0);
  const isLowCalorie   = (energy !== undefined && energy < 15) ||
                         (totalNutrients.length >= 2 && sumNutrients < 2);

  const additiveCount = (ingr.match(/\be\d{3,4}[a-z]?\b/g) || []).length;

  const flags = [];
  if (isLowCalorie)                                      flags.push('low_calorie');
  if (nova === 4)                                        flags.push('ultra');
  if (sugar  !== undefined && sugar  > 22)               flags.push('high_sugar');
  if (fat    !== undefined && fat    > 20)               flags.push('high_fat');
  if (satfat !== undefined && satfat > 10)               flags.push('high_satfat');
  if (salt   !== undefined && salt   > 1.5)              flags.push('high_salt');
  if (sodium !== undefined && sodium > 0.6 && !flags.includes('high_salt')) flags.push('high_sodium');
  if (additiveCount >= 4)                                flags.push('high_additive');

  let score = 0;
  const nutriScore = { A: 3, B: 2, C: 0, D: -2, E: -3 };
  if (nutri && nutriScore[nutri] !== undefined) score += nutriScore[nutri];

  if (flags.includes('ultra'))         score -= 3;
  if (flags.includes('high_sugar'))    score -= 2;
  if (flags.includes('high_satfat'))   score -= 2;
  if (flags.includes('high_fat'))      score -= 1;
  if (flags.includes('high_salt'))     score -= 2;
  if (flags.includes('high_sodium'))   score -= 1;
  if (flags.includes('high_additive')) score -= 2;
  if (fiber    !== undefined && fiber    >= 3)  score += 1;
  if (proteins !== undefined && proteins >= 10) score += 1;
  if (nova >= 1 && nova <= 2)                   score += 1;

  if (flags.includes('low_calorie')) {
    return { verdictKey: 'ok', flags, energy, sugar, fat, satfat, salt, proteins, fiber,
             verdictReason: LANGS[lang].reasons.low_calorie() };
  }

  const verdictKey = score >= 3 ? 'good' : score >= 0 ? 'ok' : 'bad';
  const R = LANGS[lang].reasons;
  const verdictReason =
    flags.includes('high_sugar')   ? R.high_sugar(sugar)   :
    flags.includes('ultra')        ? R.ultra()              :
    flags.includes('high_satfat')  ? R.high_satfat(satfat) :
    flags.includes('high_fat')     ? R.high_fat(fat)        :
    flags.includes('high_salt')    ? R.high_salt(salt)      :
    verdictKey === 'good' && proteins >= 10 ? R.good_prot(proteins) :
    verdictKey === 'good'          ? R.balanced()           :
    R.default();

  return { verdictKey, flags, energy, sugar, fat, satfat, salt, proteins, fiber, verdictReason };
}

/* ── Render ── */
function renderProduct(p) {
  const L    = LANGS[lang];
  const nutr = p.nutriments || {};
  const nutri = (p.nutriscore_grade || '').toUpperCase();
  const nova  = parseInt(p.nova_group) || 0;

  const { verdictKey, flags, energy, sugar, fat, satfat, salt, proteins, fiber, verdictReason }
    = computeVerdict(p);

  // Détections (productName, hasPork, hasAlcohol, etc.)
  const productName = (p.product_name || '').toLowerCase();
  const genericName = (p.generic_name || '').toLowerCase();
  const ingr = (p.ingredients_text || '').toLowerCase();
  const categories = (p.categories_tags || []).join(' ').toLowerCase();
  const labels = (p.labels_tags || []).join(' ').toLowerCase();
  const allergens = (p.allergens_tags || []).join(' ').toLowerCase();
  const traces = (p.traces_tags || []).join(' ').toLowerCase();

  const specificIngredients = (p.specific_ingredients || [])
    .map(i => (i.ingredient || i.id || '').toLowerCase())
    .join(' ');

  const porkPattern = /\b(porc|pork|lard|gelatine|gélatine|saindoux|jambon|cochon|porcine|pig|bacon|ham)\b/i;
  const hasPork = porkPattern.test(ingr)
               || porkPattern.test(specificIngredients)
               || porkPattern.test(categories)
               || porkPattern.test(labels)
               || porkPattern.test(productName)
               || porkPattern.test(genericName);

  const alcoholPattern = /\b(alcool|alcohol|vin|wine|bier|beer|bière|whisky|vodka|rhum|rum|cidre|cider|champagne)\b/i;
  const hasAlcohol = alcoholPattern.test(ingr)
                  || alcoholPattern.test(specificIngredients)
                  || alcoholPattern.test(categories)
                  || alcoholPattern.test(productName);

  const glutenPattern = /\b(gluten|blé|wheat|orge|barley|seigle|rye|avoine|oats|épeautre|spelt|kamut)\b/i;
  const hasGluten = glutenPattern.test(ingr)
                 || glutenPattern.test(specificIngredients)
                 || allergens.includes('gluten')
                 || traces.includes('gluten');

  const lactosePattern = /\b(lait|milk|lactose|lactos|crème|cream|beurre|butter|fromage|cheese|yogourt|yogurt|petit-lait|whey)\b/i;
  const hasLactose = lactosePattern.test(ingr)
                   || lactosePattern.test(specificIngredients)
                   || allergens.includes('milk')
                   || traces.includes('milk');

  const notHalal = (hasPork || hasAlcohol) && !labels.includes('halal');

  const nutriBadge = nutri
    ? `<span class="badge badge-nutri-${nutri.toLowerCase()}">Nutri-Score ${nutri}</span>`
    : '';
  const novaLabel = nova ? L.nova_labels[Math.min(nova, 4)] : '';
  const novaBadge = nova
    ? `<span class="badge badge-nova-${Math.min(nova,4)}">NOVA ${nova} — ${esc(novaLabel)}</span>`
    : '';

  const imgUrl = p.image_front_small_url || p.image_front_url || '';
  const imgHtml = imgUrl
    ? `<img class="product-image" src="${esc(imgUrl)}" alt="" loading="lazy">`
    : `<div class="product-no-image">🥫</div>`;

  // ========== FONCTIONS NUTRITION ==========
  function barHtml(val, max, ok, warn) {
    if (val === undefined || val === null) return '';
    const pct = Math.min((val / max) * 100, 100).toFixed(1);
    const cls = val <= ok ? 'fill-green' : val <= warn ? 'fill-warn' : 'fill-red';
    return `<div class="nutr-bar"><div class="nutr-fill ${cls}" data-width="${pct}"></div></div>`;
  }

  function nutrItem(label, val, unit, max, ok, warn) {
    const display = (val !== undefined && val !== null) ? val.toFixed(1) : '—';
    return `
      <div class="nutr-item">
        <div class="nutr-label">${esc(label)}</div>
        <div class="nutr-value">${esc(display)}<span class="nutr-unit">${esc(unit)}</span></div>
        ${val !== undefined ? barHtml(val, max, ok, warn) : ''}
      </div>`;
  }

// Thresholds for color coding (per 100g). Returns 'green' | 'warn' | 'red' | null
  function nutrColorClass(name, valG) {
    if (valG === undefined || valG === null) return null;
    const n = name.toLowerCase();
    if (n === 'sugars')           return valG <= 5  ? 'nutr-good' : valG <= 22  ? 'nutr-warn' : 'nutr-bad';
    if (n === 'fat')              return valG <= 10 ? 'nutr-good' : valG <= 20  ? 'nutr-warn' : 'nutr-bad';
    if (n === 'saturated-fat')    return valG <= 3  ? 'nutr-good' : valG <= 10  ? 'nutr-warn' : 'nutr-bad';
    if (n === 'salt')             return valG <= 0.6? 'nutr-good' : valG <= 1.5 ? 'nutr-warn' : 'nutr-bad';
    if (n === 'sodium')           return valG <= 0.24? 'nutr-good': valG <= 0.6 ? 'nutr-warn' : 'nutr-bad';
    if (n === 'proteins')         return valG >= 10 ? 'nutr-good' : valG >= 5   ? 'nutr-warn' : null;
    if (n === 'fiber')            return valG >= 6  ? 'nutr-good' : valG >= 3   ? 'nutr-warn' : null;
    if (n === 'energy-kcal' || n === 'energy') return valG <= 150 ? 'nutr-good' : valG <= 400 ? 'nutr-warn' : 'nutr-bad';
    return null;
  }

function buildNutritionGrid() {
  // Ordered allowlist — removes duplicates & non-nutrients (nova-group, fruits-estimate, etc.)
  const NUTR_ALLOWED = [
    { key: 'energy-kcal',    icon: '🔥' },
    { key: 'carbohydrates',  icon: '🌾' },
    { key: 'sugars',         icon: '🍬' },
    { key: 'fat',            icon: '🧈' },
    { key: 'saturated-fat',  icon: '🧈' },
    { key: 'proteins',       icon: '🥩' },
    { key: 'fiber',          icon: '🌿' },
    { key: 'salt',           icon: '🧂' },
  ];

  const entries = NUTR_ALLOWED
    .map(({ key, icon }) => {
      const val = nutr[key + '_100g'];
      if (val === undefined || val === null || typeof val !== 'number' || val < 0) return null;
      const unit  = nutr[key + '_unit'] || 'g';
      const label = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return { name: key, label, baseVal: val, unit, icon };
    })
    .filter(Boolean);

  if (!entries.length) return `<div class="nutr-item"><div class="nutr-label">—</div></div>`;

  return entries.map(e => {
    // Smart unit: display in mg when value < 1 g (and stored in g)
    const storedInG = e.unit === 'g';
    let displayUnit, displayVal;
    if (storedInG && e.baseVal < 1) {
      displayUnit = 'mg';
      displayVal  = (e.baseVal * 1000).toFixed(1);
    } else if (storedInG) {
      displayUnit = 'g';
      displayVal  = e.baseVal.toFixed(1);
    } else {
      // already in mg/µg/kcal — show as-is
      displayUnit = e.unit;
      displayVal  = e.unit === 'µg'
        ? (e.baseVal * 1000000).toFixed(0)
        : e.unit === 'mg'
        ? (e.baseVal * 1000).toFixed(1)
        : e.baseVal.toFixed(1);
    }

    // Alt unit for tap-toggle pill
    let altUnit, altVal;
    if (e.unit === 'kcal' || e.name === 'energy-kcal') {
      altUnit = 'kJ';
      altVal  = (e.baseVal * 4.184).toFixed(0);
    } else if (displayUnit === 'mg') {
      altUnit = 'g';
      altVal  = e.baseVal.toFixed(3);
    } else if (displayUnit === 'g') {
      altUnit = 'mg';
      altVal  = (e.baseVal * 1000).toFixed(1);
    } else {
      altUnit = null;
      altVal  = null;
    }

    const colorCls = nutrColorClass(e.name, e.baseVal) || '';

    const toggleHtml = altUnit
      ? `<button class="nutr-unit-pill" data-val="${esc(displayVal)}" data-unit="${esc(displayUnit)}" data-alt-val="${esc(altVal)}" data-alt-unit="${esc(altUnit)}" aria-label="Changer l'unité">${esc(displayUnit)}</button>`
      : `<span class="nutr-unit">${esc(displayUnit)}</span>`;

    return `
      <div class="nutr-item ${colorCls}">
        <div class="nutr-label"><span class="nutr-icon" aria-hidden="true">${e.icon}</span>${esc(e.label)}</div>
        <div class="nutr-value-row">
          <span class="nutr-val-display ${colorCls}">${esc(displayVal)}</span>
          ${toggleHtml}
        </div>
      </div>`;
  }).join('');
}

  // Construction des avertissements
  const warningItems = [];
  if (notHalal) warningItems.push({ type:'alert', key:'halal' });
  else warningItems.push({ type:'ok', key:'ok_halal' });
  if (hasPork && !notHalal) warningItems.push({ type:'alert', key:'pork' });
  if (hasGluten) warningItems.push({ type:'alert', key:'gluten' });
  if (hasLactose) warningItems.push({ type:'alert', key:'lactose' });
  if (flags.includes('ultra')) warningItems.push({ type:'alert', key:'ultra' });
  if (flags.includes('high_salt') || flags.includes('high_sodium'))
    warningItems.push({ type:'alert', key:'high_sodium' });
  if (flags.includes('high_satfat')) warningItems.push({ type:'alert', key:'high_satfat' });
  if (flags.includes('high_additive')) warningItems.push({ type:'alert', key:'high_additive' });
  if (flags.includes('low_calorie')) warningItems.push({ type:'ok', key:'low_calorie' });

  const warningsHtml = warningItems.map(w => {
    const [title, desc] = L.warnings[w.key] || ['?', ''];
    return `
      <div class="warning-item ${w.type === 'ok' ? 'warn-ok' : 'warn-alert'}">
        <div class="warning-dot ${w.type === 'ok' ? 'dot-green' : 'dot-red'}"></div>
        <div class="warning-text"><strong>${esc(title)}</strong>${esc(desc)}</div>
      </div>`;
  }).join('');

  const ingText = p.ingredients_text
    ? `<div class="section-block">
        <div class="section-title">${esc(L.sections.ingredients)}</div>
        <div class="ingredients-box">
          <div class="ingredients-text">${esc(p.ingredients_text.slice(0, 400))}${p.ingredients_text.length > 400 ? '…' : ''}</div>
        </div>
       </div>`
    : '';

  const altHtml = `<div class="section-block" id="altSection">
    <div class="section-title">${esc(L.sections.alternative)}</div>
    <div id="altContainer">
      <div class="alt-card alt-card-best" id="altCard" role="button" tabindex="0">
        <div class="alt-icon">${getCategoryEmoji(p)}</div>
        <div class="alt-info">
          <div class="alt-label" id="altLabel">${esc(L.alt_best_label)}</div>
          <div class="alt-name" id="altName">${esc(L.alt_loading)}</div>
          <div class="alt-brand" id="altBrand"></div>
        </div>
        <div class="alt-arrow" id="altArrow">→</div>
      </div>
      <div id="altOthers" style="display:none"></div>
      <div id="altSeenAll" style="display:none;text-align:center;font-size:.8rem;color:var(--c-muted);padding:.5rem 0"></div>
    </div>
   </div>`;

  const ecoHtml = buildEcoSection(p, L);
  const infoHtml = buildInfoSection(p, L);

  const html = `
    <div class="product-header">
      ${imgHtml}
      <div class="product-info">
        <div class="product-name">${esc(p.product_name || p.product_name_fr || '—')}</div>
        <div class="product-brand">${esc(p.brands || '')}</div>
        <div class="badges-row">${nutriBadge}${novaBadge}</div>
      </div>
    </div>

    <div class="verdict-card verdict-${verdictKey}">
      <div class="verdict-label">${L.verdict[verdictKey]}</div>
      <div class="verdict-reason">${esc(verdictReason)}</div>
    </div>

    <div class="section-block">
      <div class="section-title">${esc(L.sections.nutrition)}</div>
      <div class="nutrition-grid">
        ${buildNutritionGrid()}
      </div>
    </div>

    <div class="section-block">
      <div class="section-title">${esc(L.sections.warnings)}</div>
      <div class="warnings-list">${warningsHtml}</div>
    </div>

    ${ingText}
    ${infoHtml}
    ${ecoHtml}
    ${altHtml}

    <div class="share-row">
      <button class="share-qr-btn" id="shareQrBtn">📤 ${esc(L.share_title)}</button>
    </div>
  `;

  const resultArea = $('resultArea');
  resultArea.innerHTML = html;
  resultArea.classList.add('visible');

  resultArea.querySelectorAll('.nutr-fill[data-width]').forEach(el => {
    el.style.setProperty('--bar-width', el.dataset.width + '%');
  });
// Tap-to-toggle unit pills
  resultArea.querySelectorAll('.nutr-unit-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const isAlt = pill.dataset.showing === 'alt';
      if (isAlt) {
        // revert to primary
        pill.closest('.nutr-item').querySelector('.nutr-val-display').textContent = pill.dataset.val;
        pill.textContent = pill.dataset.unit;
        delete pill.dataset.showing;
      } else {
        // switch to alt
        pill.closest('.nutr-item').querySelector('.nutr-val-display').textContent = pill.dataset.altVal;
        pill.textContent = pill.dataset.altUnit;
        pill.dataset.showing = 'alt';
      }
    });
  });

  fetchAlternative(p);

  const shareBtn = document.getElementById('shareQrBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => showQRModal(p.code, p.product_name));
  }
}

/* ── Product Info Section ── */
function buildInfoSection(p, L) {
  const lb = L.labels;
  const rows = [];

  if (p.quantity) rows.push(infoRow(lb.quantity, esc(p.quantity)));

  const packagings = p.packaging_tags || [];
  const packText = packagings
    .map(t => t.replace(/^en:|^fr:/, '').replace(/-/g, ' '))
    .filter(Boolean).slice(0, 4).join(', ');
  if (packText) rows.push(infoRow(lb.packaging, `<span class="info-pack">${esc(packText)}</span>`));

  const originsRaw = p.origins || (p.origins_tags || []).map(t => t.replace(/^en:|^fr:/, '').replace(/-/g, ' ')).join(', ');
  if (originsRaw) rows.push(infoRow(lb.origin, esc(originsRaw)));

  const countries = (p.countries_tags || [])
    .map(t => t.replace(/^en:|^fr:/, '').replace(/-/g, ' '))
    .slice(0, 3).join(', ');
  if (countries) rows.push(infoRow(lb.countries, esc(countries)));

  if (rows.length === 0) return '';
  return `<div class="section-block">
    <div class="section-title">${esc(L.sections_extra.product_info)}</div>
    <div class="info-table">${rows.join('')}</div>
  </div>`;
}

function infoRow(label, valueHtml) {
  return `<div class="info-row">
    <span class="info-label">${esc(label)}</span>
    <span class="info-value">${valueHtml}</span>
  </div>`;
}

/* ── Eco Section ── */
function buildEcoSection(p, L) {
  const lb = L.labels;
  const parts = [];

  const gs = (p.ecoscore_grade || '').toUpperCase();
  if (gs && /^[A-E]$/.test(gs)) {
    const gsIdx = 'ABCDE'.indexOf(gs) + 1;
    const gsLabel = (L.green_labels[gsIdx] || gs).replace(/^[A-E] — /, '');
    const gsScore = p.ecoscore_score;
    parts.push(`
      <div class="eco-item eco-item-full">
        <div class="eco-item-label">${esc(lb.green_score)}</div>
        <div class="eco-grade-row">
          <span class="eco-badge eco-grade-${gs.toLowerCase()}">${esc(gs)}</span>
          <span class="eco-grade-text">${esc(gsLabel)}</span>
          ${gsScore !== undefined ? `<span class="eco-score-num">${gsScore}/100</span>` : ''}
        </div>
        <div class="eco-grade-bar-track">${'ABCDE'.split('').map(g =>
          `<div class="eco-grade-seg eco-grade-seg-${g.toLowerCase()}${g === gs ? ' eco-seg-active' : ''}"></div>`
        ).join('')}</div>
      </div>`);
  }

  const carbonVal = p.ecoscore_data && p.ecoscore_data.agribalyse && p.ecoscore_data.agribalyse.co2_total;
  if (carbonVal !== undefined && carbonVal !== null) {
    const carbonClass = carbonVal < 1 ? 'carbon-low' : carbonVal < 5 ? 'carbon-mid' : 'carbon-high';
    parts.push(`
      <div class="eco-item">
        <div class="eco-item-label">${esc(lb.carbon)}</div>
        <div class="carbon-row">
          <span class="carbon-val ${carbonClass}">${carbonVal.toFixed(2)}</span>
          <span class="carbon-unit">kg CO₂/kg</span>
        </div>
      </div>`);
  }

  const labelTags = (p.labels_tags || []).join(' ');
  const hasTriman = /triman/.test(labelTags);
  parts.push(`
    <div class="eco-item">
      <div class="eco-item-label">${esc(lb.triman)}</div>
      <div class="triman-row ${hasTriman ? 'triman-yes' : 'triman-no'}">
        ${hasTriman
          ? `<span class="triman-icon">♻️</span><span>${esc(lb.triman_yes.replace('♻️ ', ''))}</span>`
          : `<span class="triman-icon-no">✕</span><span>${esc(lb.triman_no)}</span>`}
      </div>
    </div>`);

  return `<div class="section-block">
    <div class="section-title">${esc(L.sections_extra.eco)}</div>
    <div class="eco-grid">${parts.join('')}</div>
  </div>`;
}

/* ── Category emoji ── */
function getCategoryEmoji(p) {
  const cats = (p.categories_tags || []).join(' ');
  if (/beverage|boisson|drink|eau/.test(cats))   return '🥤';
  if (/chocolate|chocolat/.test(cats))            return '🍫';
  if (/biscuit|cookie/.test(cats))               return '🍪';
  if (/cereal|céréale/.test(cats))               return '🥣';
  if (/dairy|lait|fromage|cheese/.test(cats))    return '🧀';
  if (/fruit/.test(cats))                        return '🍎';
  if (/pasta|pâte|spaghetti/.test(cats))         return '🍝';
  if (/bread|pain/.test(cats))                   return '🍞';
  if (/yogurt|yaourt/.test(cats))                return '🥛';
  if (/sauce|condiment/.test(cats))              return '🥫';
  if (/meat|viande|poultry/.test(cats))          return '🍖';
  if (/fish|poisson|seafood/.test(cats))         return '🐟';
  if (/vegetable|légume/.test(cats))             return '🥦';
  return '🥗';
}

/* ══════════════════════════════════════════════
   FETCH ALTERNATIVE
══════════════════════════════════════════════ */
async function fetchAlternative(p) {
  const nameEl  = $('altName');
  const brandEl = $('altBrand');
  const card    = $('altCard');
  const label   = $('altLabel');
  const arrow   = $('altArrow');
  if (!nameEl) return;

  const L = LANGS[lang];
  const currentGrade = (p.nutriscore_grade || '').toLowerCase();
  const gradeOrder   = { a:1, b:2, c:3, d:4, e:5 };
  const currentRank  = gradeOrder[currentGrade] ?? 99;

  const catTags = [...(p.categories_tags || [])].reverse().slice(0, 5);

  let candidates = [];
  for (const catTag of catTags) {
    if (candidates.length >= 5) break;
    const results = await tryFetchAlt(catTag, p.code, currentRank);
    results.forEach(r => {
      if (!candidates.find(c => c.code === r.code)) candidates.push(r);
    });
  }

  candidates.sort((x, y) => {
    const gx = gradeOrder[(x.nutriscore_grade || 'e').toLowerCase()] ?? 5;
    const gy = gradeOrder[(y.nutriscore_grade || 'e').toLowerCase()] ?? 5;
    if (gx !== gy) return gx - gy;
    return (x.product_name || '').localeCompare(y.product_name || '');
  });
  candidates = candidates.slice(0, 5);

  if (candidates.length === 0) {
    if (card) card.style.cursor = 'default';
    if (arrow) arrow.style.display = 'none';
    if (label) label.textContent = '';
    nameEl.textContent  = currentRank <= 2 ? L.alt_already_best : L.alt_bad_no_alt;
    brandEl.textContent = '';
    return;
  }

  const best = candidates[0];
  applyAlt(best, card, nameEl, brandEl, label);

  const othersEl  = $('altOthers');
  const seenAllEl = $('altSeenAll');
  const rest = candidates.slice(1);

  if (rest.length > 0 && othersEl) {
    othersEl.innerHTML = `
      <div class="alt-others-title">${esc(L.alt_others)} (${rest.length})</div>
      ${rest.map(alt => `
        <div class="alt-card alt-card-other" data-code="${esc(alt.code)}" role="button" tabindex="0">
          <div class="alt-info">
            <div class="alt-name">${esc(alt.product_name)}</div>
            <div class="alt-brand">${esc(alt.brands || '')}${alt.nutriscore_grade ? ` · Nutri-Score ${alt.nutriscore_grade.toUpperCase()}` : ''}</div>
          </div>
          <div class="alt-arrow">→</div>
        </div>`).join('')}`;
    othersEl.style.display = 'block';
    othersEl.querySelectorAll('.alt-card-other').forEach(el => {
      el.addEventListener('click', () => openAltModal(el.dataset.code));
    });
  }

  if (seenAllEl) {
    seenAllEl.textContent = L.alt_top_count(candidates.length);
    seenAllEl.style.display = 'block';
  }
}

async function tryFetchAlt(catTag, excludeCode, currentRank) {
  const gradeOrder = { a:1, b:2, c:3, d:4, e:5 };
  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags=${encodeURIComponent(catTag)}&page_size=50&fields=code,product_name,brands,nutriscore_grade,nova_group,nutriments`;
 const res  = await fetch(OFF_SEARCH(url), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();

    return (data.products || []).filter(pr => {
      if (!pr.product_name || pr.code === excludeCode) return false;
      const grade = (pr.nutriscore_grade || '').toLowerCase();
      const rank  = gradeOrder[grade] ?? 99;
      if (rank >= currentRank) return false;
      const nova = parseInt(pr.nova_group) || 0;
      if (nova === 4) return false;
      // ADD after the nova check:
const nutr = pr.nutriments || {};
const sugar  = nutr.sugars_100g  || 0;
const satfat = nutr['saturated-fat_100g'] || 0;
const salt   = nutr.salt_100g   || 0;
if (sugar > 22 && satfat > 10 && salt > 1.5) return false; // skip nutritionally poor products
      const energy   = nutr['energy-kcal_100g'] ?? nutr.energy_100g;
      const proteins = nutr.proteins_100g;
      const fat      = nutr.fat_100g;
      if (!energy || (!proteins && !fat)) return false;
      return true;
    });
  } catch (_) {
    return [];
  }
}

function applyAlt(alt, card, nameEl, brandEl, labelEl) {
  nameEl.textContent  = alt.product_name;
  brandEl.textContent = (alt.brands || '') + (alt.nutriscore_grade ? ` · Nutri-Score ${alt.nutriscore_grade.toUpperCase()}` : '');
  if (labelEl) labelEl.textContent = LANGS[lang].alt_best_label;
  if (card) {
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    newCard.addEventListener('click', () => openAltModal(alt.code));
  }
}

/* ══════════════════════════════════════════════
   ALTERNATIVE MODAL
══════════════════════════════════════════════ */
async function openAltModal(code) {
  const L = LANGS[lang];

  const overlay = document.createElement('div');
  overlay.id = 'altModal';
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" id="modalClose" aria-label="Fermer">✕</button>
      <div class="modal-body" id="modalBody">
        <div class="modal-loading">${esc(L.alt_loading)}</div>
      </div>
      <div class="modal-footer">
        <a class="modal-off-link" href="https://world.openfoodfacts.org/product/${encodeURIComponent(code)}" target="_blank" rel="noopener">
          🔗 Voir sur Open Food Facts
        </a>
        <button class="modal-scan-btn" id="modalScanBtn">🔍 Analyser ce produit</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  $('modalClose').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
  });

  $('modalScanBtn').addEventListener('click', () => {
    close();
    $('barcodeInput').value = code;
    handleScan();
  });

  try {
  const res  = await fetch(OFF(code),
      { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (data.status !== 1 || !data.product) throw new Error();

    const p    = data.product;
    const nutr = p.nutriments || {};
    const nutri = (p.nutriscore_grade || '').toUpperCase();
    const nova  = parseInt(p.nova_group) || 0;
    const { verdictKey, verdictReason } = computeVerdict(p);

    const nutriBadge = nutri ? `<span class="badge badge-nutri-${nutri.toLowerCase()}">Nutri-Score ${nutri}</span>` : '';
    const novaLabel  = nova  ? L.nova_labels[Math.min(nova, 4)] : '';
    const novaBadge  = nova  ? `<span class="badge badge-nova-${Math.min(nova,4)}">NOVA ${nova} — ${esc(novaLabel)}</span>` : '';
    const imgUrl     = p.image_front_small_url || p.image_front_url || '';
    const imgHtml    = imgUrl
      ? `<img class="modal-product-img" src="${esc(imgUrl)}" alt="" loading="lazy">`
      : `<div class="modal-product-no-img">🥫</div>`;

    /* ── Dynamic nutrition grid (same logic as main view) ── */
    function modalNutrColorClass(name, valG) {
      if (valG === undefined || valG === null) return '';
      const n = name.toLowerCase();
      if (n === 'sugars')        return valG <= 5   ? 'nutr-good' : valG <= 22  ? 'nutr-warn' : 'nutr-bad';
      if (n === 'fat')           return valG <= 10  ? 'nutr-good' : valG <= 20  ? 'nutr-warn' : 'nutr-bad';
      if (n === 'saturated-fat') return valG <= 3   ? 'nutr-good' : valG <= 10  ? 'nutr-warn' : 'nutr-bad';
      if (n === 'salt')          return valG <= 0.6 ? 'nutr-good' : valG <= 1.5 ? 'nutr-warn' : 'nutr-bad';
      if (n === 'sodium')        return valG <= 0.24? 'nutr-good' : valG <= 0.6 ? 'nutr-warn' : 'nutr-bad';
      if (n === 'proteins')      return valG >= 10  ? 'nutr-good' : valG >= 5   ? 'nutr-warn' : '';
      if (n === 'fiber')         return valG >= 6   ? 'nutr-good' : valG >= 3   ? 'nutr-warn' : '';
      if (n === 'energy-kcal' || n === 'energy') return valG <= 150 ? 'nutr-good' : valG <= 400 ? 'nutr-warn' : 'nutr-bad';
      return '';
    }

    function buildModalNutrGrid() {
      const NUTR_ALLOWED = [
        { key: 'energy-kcal',   icon: '🔥' },
        { key: 'carbohydrates', icon: '🌾' },
        { key: 'sugars',        icon: '🍬' },
        { key: 'fat',           icon: '🧈' },
        { key: 'saturated-fat', icon: '🧈' },
        { key: 'proteins',      icon: '🥩' },
        { key: 'fiber',         icon: '🌿' },
        { key: 'salt',          icon: '🧂' },
      ];

      const entries = NUTR_ALLOWED
        .map(({ key, icon }) => {
          const val = nutr[key + '_100g'];
          if (val === undefined || val === null || typeof val !== 'number' || val < 0) return null;
          const unit  = nutr[key + '_unit'] || 'g';
          const label = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return { name: key, label, baseVal: val, unit, icon };
        })
        .filter(Boolean);

      if (!entries.length) return `<div class="modal-nutr-row"><span>—</span><strong>—</strong></div>`;

      return entries.map(e => {
        const storedInG = e.unit === 'g';
        let displayUnit, displayVal;
        if (storedInG && e.baseVal < 1) {
          displayUnit = 'mg'; displayVal = (e.baseVal * 1000).toFixed(1);
        } else if (storedInG) {
          displayUnit = 'g';  displayVal = e.baseVal.toFixed(1);
        } else {
          displayUnit = e.unit;
          displayVal  = e.unit === 'µg' ? (e.baseVal * 1e6).toFixed(0)
                      : e.unit === 'mg' ? (e.baseVal * 1000).toFixed(1)
                      : e.baseVal.toFixed(1);
        }

        let altUnit, altVal;
        if (e.unit === 'kcal' || e.name === 'energy-kcal') {
          altUnit = 'kJ';  altVal = (e.baseVal * 4.184).toFixed(0);
        } else if (displayUnit === 'mg') {
          altUnit = 'g';   altVal = e.baseVal.toFixed(3);
        } else if (displayUnit === 'g') {
          altUnit = 'mg';  altVal = (e.baseVal * 1000).toFixed(1);
        } else {
          altUnit = null; altVal = null;
        }

        const colorCls = modalNutrColorClass(e.name, e.baseVal);
        const pillHtml = altUnit
          ? `<button class="modal-nutr-pill" data-val="${esc(displayVal)}" data-unit="${esc(displayUnit)}" data-alt-val="${esc(altVal)}" data-alt-unit="${esc(altUnit)}">${esc(displayUnit)}</button>`
          : `<span class="modal-nutr-unit-plain">${esc(displayUnit)}</span>`;

        return `
          <div class="modal-nutr-row">
            <span class="modal-nutr-label"><span class="nutr-icon" aria-hidden="true">${e.icon}</span>${esc(e.label)}</span>
            <div class="modal-nutr-val-wrap">
              <strong class="modal-nutr-val ${colorCls}">${esc(displayVal)}</strong>
              ${pillHtml}
            </div>
          </div>`;
      }).join('');
    }

    /* ── Warnings (same logic as main view) ── */
    const ingr       = (p.ingredients_text || '').toLowerCase();
    const categories = (p.categories_tags  || []).join(' ').toLowerCase();
    const labels_t   = (p.labels_tags      || []).join(' ').toLowerCase();
    const allergens  = (p.allergens_tags   || []).join(' ').toLowerCase();
    const traces     = (p.traces_tags      || []).join(' ').toLowerCase();
    const specIngr   = (p.specific_ingredients || []).map(i => (i.ingredient || i.id || '').toLowerCase()).join(' ');
    const pName      = (p.product_name || '').toLowerCase();

    const porkPat    = /\b(porc|pork|lard|gelatine|gélatine|saindoux|jambon|cochon|porcine|pig|bacon|ham)\b/i;
    const alcoholPat = /\b(alcool|alcohol|vin|wine|bier|beer|bière|whisky|vodka|rhum|rum|cidre|cider|champagne)\b/i;
    const glutenPat  = /\b(gluten|blé|wheat|orge|barley|seigle|rye|avoine|oats|épeautre|spelt|kamut)\b/i;
    const lacPat     = /\b(lait|milk|lactose|lactos|crème|cream|beurre|butter|fromage|cheese|yogourt|yogurt|petit-lait|whey)\b/i;

    const hasPork    = porkPat.test(ingr)    || porkPat.test(specIngr)   || porkPat.test(categories) || porkPat.test(labels_t) || porkPat.test(pName);
    const hasAlcohol = alcoholPat.test(ingr) || alcoholPat.test(specIngr)|| alcoholPat.test(categories)|| alcoholPat.test(pName);
    const hasGluten  = glutenPat.test(ingr)  || glutenPat.test(specIngr) || allergens.includes('gluten')|| traces.includes('gluten');
    const hasLactose = lacPat.test(ingr)     || lacPat.test(specIngr)    || allergens.includes('milk') || traces.includes('milk');
    const notHalal   = (hasPork || hasAlcohol) && !labels_t.includes('halal');

    const { flags } = computeVerdict(p);

    const warnItems = [];
    if (notHalal) warnItems.push({ type:'alert', key:'halal' });
    else          warnItems.push({ type:'ok',    key:'ok_halal' });
    if (hasPork && !notHalal) warnItems.push({ type:'alert', key:'pork' });
    if (hasGluten)  warnItems.push({ type:'alert', key:'gluten' });
    if (hasLactose) warnItems.push({ type:'alert', key:'lactose' });
    if (flags.includes('ultra'))        warnItems.push({ type:'alert', key:'ultra' });
    if (flags.includes('high_salt') || flags.includes('high_sodium')) warnItems.push({ type:'alert', key:'high_sodium' });
    if (flags.includes('high_satfat'))  warnItems.push({ type:'alert', key:'high_satfat' });
    if (flags.includes('high_additive'))warnItems.push({ type:'alert', key:'high_additive' });
    if (flags.includes('low_calorie'))  warnItems.push({ type:'ok',    key:'low_calorie' });

    const warningsHtml = warnItems.map(w => {
      const [title, desc] = L.warnings[w.key] || ['?', ''];
      return `<div class="warning-item ${w.type === 'ok' ? 'warn-ok' : 'warn-alert'}">
        <div class="warning-dot ${w.type === 'ok' ? 'dot-green' : 'dot-red'}"></div>
        <div class="warning-text"><strong>${esc(title)}</strong>${esc(desc)}</div>
      </div>`;
    }).join('');

    /* ── Ingredients ── */
    const ingrHtml = p.ingredients_text
      ? `<div class="modal-section-block">
           <div class="modal-section-title">${esc(L.sections.ingredients)}</div>
           <div class="ingredients-box">
             <div class="ingredients-text">${esc(p.ingredients_text.slice(0, 400))}${p.ingredients_text.length > 400 ? '…' : ''}</div>
           </div>
         </div>`
      : '';

    /* ── Product info ── */
    const lb = L.labels;
    const infoRows = [];
    if (p.quantity) infoRows.push(`<div class="info-row"><span class="info-label">${esc(lb.quantity)}</span><span class="info-value">${esc(p.quantity)}</span></div>`);
    const packText = (p.packaging_tags || []).map(t => t.replace(/^en:|^fr:/, '').replace(/-/g,' ')).filter(Boolean).slice(0,4).join(', ');
    if (packText) infoRows.push(`<div class="info-row"><span class="info-label">${esc(lb.packaging)}</span><span class="info-value">${esc(packText)}</span></div>`);
    const originsRaw = p.origins || (p.origins_tags || []).map(t => t.replace(/^en:|^fr:/, '').replace(/-/g,' ')).join(', ');
    if (originsRaw) infoRows.push(`<div class="info-row"><span class="info-label">${esc(lb.origin)}</span><span class="info-value">${esc(originsRaw)}</span></div>`);
    const countries = (p.countries_tags || []).map(t => t.replace(/^en:|^fr:/, '').replace(/-/g,' ')).slice(0,3).join(', ');
    if (countries) infoRows.push(`<div class="info-row"><span class="info-label">${esc(lb.countries)}</span><span class="info-value">${esc(countries)}</span></div>`);
    const infoSectionHtml = infoRows.length
      ? `<div class="modal-section-block">
           <div class="modal-section-title">${esc(L.sections_extra.product_info)}</div>
           <div class="info-table">${infoRows.join('')}</div>
         </div>`
      : '';

    /* ── Eco ── */
    const ecoParts = [];
    const gs = (p.ecoscore_grade || '').toUpperCase();
    if (gs && /^[A-E]$/.test(gs)) {
      const gsIdx   = 'ABCDE'.indexOf(gs) + 1;
      const gsLabel = (L.green_labels[gsIdx] || gs).replace(/^[A-E] — /, '');
      const gsScore = p.ecoscore_score;
      ecoParts.push(`
        <div class="eco-item eco-item-full">
          <div class="eco-item-label">${esc(lb.green_score)}</div>
          <div class="eco-grade-row">
            <span class="eco-badge eco-grade-${gs.toLowerCase()}">${esc(gs)}</span>
            <span class="eco-grade-text">${esc(gsLabel)}</span>
            ${gsScore !== undefined ? `<span class="eco-score-num">${gsScore}/100</span>` : ''}
          </div>
          <div class="eco-grade-bar-track">${'ABCDE'.split('').map(g =>
            `<div class="eco-grade-seg eco-grade-seg-${g.toLowerCase()}${g===gs?' eco-seg-active':''}"></div>`
          ).join('')}</div>
        </div>`);
    }
    const carbonVal = p.ecoscore_data?.agribalyse?.co2_total;
    if (carbonVal !== undefined && carbonVal !== null) {
      const carbonClass = carbonVal < 1 ? 'carbon-low' : carbonVal < 5 ? 'carbon-mid' : 'carbon-high';
      ecoParts.push(`
        <div class="eco-item">
          <div class="eco-item-label">${esc(lb.carbon)}</div>
          <div class="carbon-row">
            <span class="carbon-val ${carbonClass}">${carbonVal.toFixed(2)}</span>
            <span class="carbon-unit">kg CO₂/kg</span>
          </div>
        </div>`);
    }
    const hasTriman = /triman/.test((p.labels_tags || []).join(' '));
    ecoParts.push(`
      <div class="eco-item">
        <div class="eco-item-label">${esc(lb.triman)}</div>
        <div class="triman-row ${hasTriman ? 'triman-yes' : 'triman-no'}">
          ${hasTriman
            ? `<span class="triman-icon">♻️</span><span>${esc(lb.triman_yes.replace('♻️ ',''))}</span>`
            : `<span class="triman-icon-no">✕</span><span>${esc(lb.triman_no)}</span>`}
        </div>
      </div>`);
    const ecoSectionHtml = `
      <div class="modal-section-block">
        <div class="modal-section-title">${esc(L.sections_extra.eco)}</div>
        <div class="eco-grid">${ecoParts.join('')}</div>
      </div>`;

    /* ── Assemble modal body ── */
    $('modalBody').innerHTML = `
      <div class="modal-header">
        ${imgHtml}
        <div>
          <div class="modal-product-name">${esc(p.product_name || '—')}</div>
          <div class="modal-product-brand">${esc(p.brands || '')}</div>
          <div class="badges-row">${nutriBadge}${novaBadge}</div>
        </div>
      </div>
      <div class="verdict-card verdict-${verdictKey}">
        <div class="verdict-label">${L.verdict[verdictKey]}</div>
        <div class="verdict-reason">${esc(verdictReason)}</div>
      </div>
      <div class="modal-section-block">
        <div class="modal-section-title">${esc(L.sections.nutrition)}</div>
        <div class="modal-nutr-grid">${buildModalNutrGrid()}</div>
      </div>
      <div class="modal-section-block">
        <div class="modal-section-title">${esc(L.sections.warnings)}</div>
        <div class="warnings-list">${warningsHtml}</div>
      </div>
      ${ingrHtml}
      ${infoSectionHtml}
      ${ecoSectionHtml}`;

    /* ── Wire up tap-to-toggle unit pills ── */
    $('modalBody').querySelectorAll('.modal-nutr-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const isAlt = pill.dataset.showing === 'alt';
        const valEl = pill.closest('.modal-nutr-val-wrap').querySelector('.modal-nutr-val');
        if (isAlt) {
          valEl.textContent  = pill.dataset.val;
          pill.textContent   = pill.dataset.unit;
          delete pill.dataset.showing;
        } else {
          valEl.textContent  = pill.dataset.altVal;
          pill.textContent   = pill.dataset.altUnit;
          pill.dataset.showing = 'alt';
        }
      });
    });

  } catch (_) {
    $('modalBody').innerHTML = `<div class="modal-loading">${esc(L.not_found)}</div>`;
  }
}

/* ══════════════════════════════════════════════
   QR CODE SHARE
══════════════════════════════════════════════ */
function showQRModal(barcode, productName) {
  const existing = document.getElementById('qrModal');
  if (existing) existing.remove();

  const L = LANGS[lang];
  const url = `https://foodlens2026.netlify.app/?barcode=${encodeURIComponent(barcode)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const overlay = document.createElement('div');
  overlay.id = 'qrModal';
  overlay.innerHTML = `
    <div class="modal-box qr-modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" id="qrModalClose" aria-label="Fermer">✕</button>
      <div class="qr-modal-title">📤 ${esc(L.share_title)}</div>
      <div class="qr-modal-name">${esc(productName || barcode)}</div>
      <img class="qr-img" src="${esc(qrApiUrl)}" alt="QR Code" width="200" height="200"/>
      <div class="qr-modal-sub">${esc(L.share_sub)}</div>
      <div class="qr-copy-row">
        <input class="qr-url-input" id="qrUrlInput" value="${esc(url)}" readonly/>
        <button class="scan-btn qr-copy-btn" id="qrCopyBtn">${esc(L.share_copy)}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('qrModalClose').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', handler); }
  });

  document.getElementById('qrCopyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('qrCopyBtn');
      if (btn) {
        btn.textContent = LANGS[lang].share_copied;
        setTimeout(() => { if (btn) btn.textContent = LANGS[lang].share_copy; }, 2000);
      }
    });
  });
}

/* ══════════════════════════════════════════════
   COMPARE MODE
══════════════════════════════════════════════ */
let compareMode = false;

function setCompareMode(on) {
  compareMode = on;
  $('singleInputWrap').style.display  = on ? 'none'  : 'block';
  $('compareInputWrap').style.display = on ? 'block' : 'none';
  $('tabSingle').classList.toggle('active', !on);
  $('tabCompare').classList.toggle('active',  on);
  // hide result area when switching modes
  const ra = $('resultArea');
  ra.classList.remove('visible');
  ra.innerHTML = '';
  $('emptyState').classList.remove('empty-state-hidden');
}

async function fetchProductForCompare(barcode) {
  if (productCache.has(barcode)) return productCache.get(barcode);
 const url = OFF(barcode);
  let res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 1500));
    res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  }
  const data = await res.json();
  if (data.status !== 1 || !data.product) throw new Error('not_found');
  productCache.set(barcode, data.product);
  return data.product;
}

async function handleCompare() {
  const bA = $('barcodeA').value.trim().replace(/\s/g,'');
  const bB = $('barcodeB').value.trim().replace(/\s/g,'');
  if (!bA || !bB) return;

  // 🔥 NETTOYAGE : supprime tout modal existant avant d'en créer un nouveau
  const existingModal = document.getElementById('compareModal');
  if (existingModal) existingModal.remove();

  const btn      = $('compareBtn');
  const spinner  = $('spinnerCmp');
  const btnText  = $('compareBtnText');
  const L        = LANGS[lang];

  btn.disabled = true;
  spinner.classList.add('active');
  btnText.style.opacity = '0';
  $('loadingBar').classList.add('active');

  try {
    const [pA, pB] = await Promise.all([
      fetchProductForCompare(bA),
      fetchProductForCompare(bB),
    ]);
    showCompareModal(pA, pB);
  } catch (err) {
    console.error(err);
    showError(L.not_found);
    $('resultArea').classList.add('visible');
    $('emptyState').classList.add('empty-state-hidden');
  } finally {
    btn.disabled = false;
    spinner.classList.remove('active');
    btnText.style.opacity = '1';
    $('loadingBar').classList.remove('active');
  }
}

function showCompareModal(pA, pB) {
  const existing = document.getElementById('compareModal');
  if (existing) existing.remove();

  const L  = LANGS[lang];
  const C  = L.compare;
  const vA = computeVerdict(pA);
  const vB = computeVerdict(pB);

  // Score for winner: convert verdictKey to a number
  const scoreOf = vk => vk === 'good' ? 2 : vk === 'ok' ? 1 : 0;
  const sA = scoreOf(vA.verdictKey), sB = scoreOf(vB.verdictKey);
  const winnerSide = sA > sB ? 'A' : sB > sA ? 'B' : null; // null = tie

  const NUTR_ROWS = [
    { key: 'energy-kcal',   icon: '🔥', label: 'Énergie', unit: 'kcal', higherIsBetter: false },
    { key: 'carbohydrates', icon: '🌾', label: 'Glucides', unit: 'g',    higherIsBetter: false },
    { key: 'sugars',        icon: '🍬', label: 'Sucres',   unit: 'g',    higherIsBetter: false },
    { key: 'fat',           icon: '🧈', label: 'Lipides',  unit: 'g',    higherIsBetter: false },
    { key: 'saturated-fat', icon: '🧈', label: 'G. sat.',  unit: 'g',    higherIsBetter: false },
    { key: 'proteins',      icon: '🥩', label: 'Protéines',unit: 'g',    higherIsBetter: true  },
    { key: 'fiber',         icon: '🌿', label: 'Fibres',   unit: 'g',    higherIsBetter: true  },
    { key: 'salt',          icon: '🧂', label: 'Sel',      unit: 'g',    higherIsBetter: false },
  ];

  function getVal(p, key) {
    return p.nutriments?.[key + '_100g'] ?? null;
  }

  function smartVal(v, unit) {
    if (v === null) return { display: C.noData, unit: '' };
    if (unit === 'g' && v < 1) return { display: (v * 1000).toFixed(1), unit: 'mg' };
    return { display: v.toFixed(unit === 'kcal' ? 0 : 1), unit };
  }

  function barRow(row) {
  const vA_raw = getVal(pA, row.key);
  const vB_raw = getVal(pB, row.key);
  if (vA_raw === null && vB_raw === null) return ''; // skip fully empty rows

  const dA = smartVal(vA_raw, row.unit);
  const dB = smartVal(vB_raw, row.unit);

  // Same color thresholds as main view
  function nutrCls(key, val) {
    if (val === null) return 'cmp-bar-na';
    const k = key.toLowerCase();
    if (k === 'energy-kcal')   return val <= 150 ? 'cmp-bar-good' : val <= 400 ? 'cmp-bar-warn' : 'cmp-bar-bad';
    if (k === 'carbohydrates') return val <= 20  ? 'cmp-bar-good' : val <= 50  ? 'cmp-bar-warn' : 'cmp-bar-bad';
    if (k === 'sugars')        return val <= 5   ? 'cmp-bar-good' : val <= 22  ? 'cmp-bar-warn' : 'cmp-bar-bad';
    if (k === 'fat')           return val <= 10  ? 'cmp-bar-good' : val <= 20  ? 'cmp-bar-warn' : 'cmp-bar-bad';
    if (k === 'saturated-fat') return val <= 3   ? 'cmp-bar-good' : val <= 10  ? 'cmp-bar-warn' : 'cmp-bar-bad';
    if (k === 'proteins')      return val >= 10  ? 'cmp-bar-good' : val >= 5   ? 'cmp-bar-warn' : 'cmp-bar-na';
    if (k === 'fiber')         return val >= 6   ? 'cmp-bar-good' : val >= 3   ? 'cmp-bar-warn' : 'cmp-bar-na';
    if (k === 'salt')          return val <= 0.6 ? 'cmp-bar-good' : val <= 1.5 ? 'cmp-bar-warn' : 'cmp-bar-bad';
    return 'cmp-bar-neu';
  }

  // Absolute reference max (so bar fill = nutritional significance)
  const REF = { 'energy-kcal':900, carbohydrates:100, sugars:100, fat:100, 'saturated-fat':50, proteins:50, fiber:20, salt:5 };
  const refMax = REF[row.key] || 100;
  const pctA = vA_raw !== null ? Math.min(Math.round((vA_raw / refMax) * 100), 100) : 0;
  const pctB = vB_raw !== null ? Math.min(Math.round((vB_raw / refMax) * 100), 100) : 0;

  const clsA = nutrCls(row.key, vA_raw);
  const clsB = nutrCls(row.key, vB_raw);

  return `
    <div class="cmp-row">
      <div class="cmp-cell cmp-cell-a">
        <span class="cmp-val">${esc(dA.display)}<span class="cmp-unit">${esc(dA.unit)}</span></span>
        <div class="cmp-bar-wrap cmp-bar-wrap-a">
          <div class="cmp-bar ${clsA}" style="width:${pctA}%"></div>
        </div>
      </div>
      <div class="cmp-label-center">
        <span class="cmp-nutr-icon">${row.icon}</span>
        <span class="cmp-nutr-name">${esc(row.label)}</span>
      </div>
      <div class="cmp-cell cmp-cell-b">
        <div class="cmp-bar-wrap cmp-bar-wrap-b">
          <div class="cmp-bar ${clsB}" style="width:${pctB}%"></div>
        </div>
        <span class="cmp-val">${esc(dB.display)}<span class="cmp-unit">${esc(dB.unit)}</span></span>
      </div>
    </div>`;
}

  function productHeader(p, vk, isWinner) {
    const nutri = (p.nutriscore_grade || '').toUpperCase();
    const imgUrl = p.image_front_small_url || p.image_front_url || '';
    const img = imgUrl
      ? `<img class="cmp-product-img" src="${esc(imgUrl)}" alt="" loading="lazy">`
      : `<div class="cmp-product-no-img">🥫</div>`;
    const badge = nutri ? `<span class="badge badge-nutri-${nutri.toLowerCase()} cmp-nutri-badge">Nutri-Score ${nutri}</span>` : '';
    const winBadge = isWinner ? `<div class="cmp-winner-crown">🏆</div>` : '';
    return `
      <div class="cmp-header-card ${isWinner ? 'cmp-header-winner' : ''}">
        ${winBadge}
        ${img}
        <div class="cmp-product-name">${esc(p.product_name || '—')}</div>
        <div class="cmp-product-brand">${esc(p.brands || '')}</div>
        ${badge}
        <div class="cmp-verdict cmp-verdict-${vk}">${L.verdict[vk]}</div>
      </div>`;
  }

  const winnerBanner = winnerSide
    ? `<div class="cmp-winner-banner">
         ${C.winner} : <strong>${winnerSide === 'A' ? esc(pA.product_name || 'A') : esc(pB.product_name || 'B')}</strong>
       </div>`
    : `<div class="cmp-winner-banner cmp-tie-banner">${C.tie}</div>`;

  const overlay = document.createElement('div');
  overlay.id = 'compareModal';
  overlay.innerHTML = `
    <div class="modal-box compare-modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" id="cmpClose" aria-label="Fermer">✕</button>

      <div class="cmp-modal-title">⚖️ ${esc(C.title)}</div>

      <div class="cmp-headers">
        ${productHeader(pA, vA.verdictKey, winnerSide === 'A')}
        <div class="cmp-headers-vs">VS</div>
        ${productHeader(pB, vB.verdictKey, winnerSide === 'B')}
      </div>

      ${winnerBanner}

      <div class="cmp-section-title">${esc(L.sections.nutrition)} — ${esc(C.perHundred)}</div>
      <div class="cmp-rows">
        <div class="cmp-col-labels">
          <span class="cmp-col-tag cmp-col-a">A</span>
          <span class="cmp-col-tag cmp-col-b">B</span>
        </div>
        ${NUTR_ROWS.map(barRow).join('')}
      </div>

      <div class="cmp-actions">
        <button class="cmp-action-btn" id="cmpFullA">🔍 ${esc(C.viewFull)} A</button>
        <button class="cmp-action-btn" id="cmpFullB">🔍 ${esc(C.viewFull)} B</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  $('cmpClose').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function h(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', h); }
  });

  $('cmpFullA').addEventListener('click', () => { close(); setCompareMode(false); lastProduct = pA; renderProduct(pA); });
  $('cmpFullB').addEventListener('click', () => { close(); setCompareMode(false); lastProduct = pB; renderProduct(pB); });
}

/* ── Events ── */
$('barcodeInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleScan();
});

$('scanBtn').addEventListener('click', () => handleScan());

$('tabSingle').addEventListener('click',  () => setCompareMode(false));
$('tabCompare').addEventListener('click', () => setCompareMode(true));
$('compareBtn').addEventListener('click', () => handleCompare());
$('barcodeA').addEventListener('keydown', e => { if (e.key === 'Enter') handleCompare(); });
$('barcodeB').addEventListener('keydown', e => { if (e.key === 'Enter') handleCompare(); });

document.querySelectorAll('.example-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    $('barcodeInput').value = chip.dataset.barcode;
    handleScan();
  });
});

/* ── Save lang preference ── */
(function () {
  const saved = localStorage.getItem('foodlens_lang');
  if (saved && LANGS[saved]) setLang(saved);
})();

document.querySelectorAll('.lang-btn').forEach(b => {
  b.addEventListener('click', () => {
    setLang(b.dataset.lang);
    localStorage.setItem('foodlens_lang', b.dataset.lang);
  });
});

/* ── Auto-scan from shared QR link ── */
(function () {
  const params  = new URLSearchParams(window.location.search);
  const barcode = params.get('barcode');
  if (barcode) {
    $('barcodeInput').value = barcode;
    handleScan();
  }
})();