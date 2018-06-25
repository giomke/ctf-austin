/* jslint node: true */
const models = require('../models/index')
const datacache = require('./datacache')
const config = require('config')
const utils = require('../lib/utils')
const mongodb = require('./mongodb')
const challenges = datacache.challenges
const users = datacache.users
const products = datacache.products

module.exports = () => {
  // TODO Wrap enttire datacreator into promise to avoid race condition with websocket registration for progress restore
  createChallenges()
  createUsers()
  createRandomFakeUsers()
  createProducts()
  createBaskets()
  createFeedback()
  createComplaints()
  createRecycles()
  createSecurityQuestions()
  createSecurityAnswers()
}

function createChallenges () {
  const addHint = hint => config.get('application.showChallengeHints') ? hint : null
  
  models.Challenge.create({
    name: 'Score Board',
    category: 'Information Leakage',
    description: 'იპოვე დამალული \'Score Board\' გვერდი.',
    difficulty: 1,
    hint: addHint('Try to find a reference or clue behind the scenes. Or simply guess what URL the Score Board might have.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/score-board.html#find-the-carefully-hidden-score-board-page'),
    solved: false
  }).success(challenge => {
    challenges.scoreBoardChallenge = challenge
  })
  models.Challenge.create({
    name: 'Error Handling',
    category: 'Information Leakage',
    description: 'გამოიწვიე შეცდომა სერვერზე',
    difficulty: 1,
    hint: addHint('Try to submit bad input to forms. Alternatively tamper with URL paths or parameters.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/leakage.html#provoke-an-error-that-is-not-very-gracefully-handled'),
    solved: false
  }).success(challenge => {
    challenges.errorHandlingChallenge = challenge
  })
  models.Challenge.create({
    name: 'Login Admin',
    category: 'SQL Injection',
    description: 'დალოგინდი ადმინის ანგარიშით',
    difficulty: 2,
    hint: addHint('Try different SQL Injection attack patterns depending whether you know the admin\'s email address or not.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/sqli.html#log-in-with-the-administrators-user-account'),
    solved: false
  }).success(challenge => {
    challenges.loginAdminChallenge = challenge
  })
  models.Challenge.create({
    name: 'Login Jim',
    category: 'SQL Injection',
    description: 'დალოგინდი Jim -ის ანგარიშზე.',
    difficulty: 3,
    hint: addHint('Try cracking Jim\'s password hash if you harvested it already. Alternatively, if you know Jim\'s email address, try SQL Injection.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/sqli.html#log-in-with-jims-user-account'),
    solved: false
  }).success(challenge => {
    challenges.loginJimChallenge = challenge
  })
  models.Challenge.create({
    name: 'Login Bender',
    category: 'SQL Injection',
    description: 'დალოგინდი Bender -ის ანგარიშზე.',
    difficulty: 3,
    hint: addHint('If you know Bender\'s email address, try SQL Injection. Bender\'s password hash might not help you very much.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/sqli.html#log-in-with-benders-user-account'),
    solved: false
  }).success(challenge => {
    challenges.loginBenderChallenge = challenge
  })
  models.Challenge.create({
    name: 'XSS1',
    category: 'XSS',
    description: 'განახორციელე <i>reflected</i> XSS შეტევა შემდეგი კოდით <code>&lt;script&gt;alert("XSS1")&lt;/script&gt;</code>.',
    difficulty: 1,
    hint: addHint('Look for an input field where its content appears in the response HTML when its form is submitted.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/xss.html#perform-a-reflected-xss-attack'),
    solved: false
  }).success(challenge => {
    challenges.localXssChallenge = challenge
  })
  models.Challenge.create({
    name: 'XSS2',
    category: 'XSS',
    description: 'განახორციელე <i>persisted</i> XSS შეტევა შემდეგი კოდით <code>&lt;script&gt;alert("XSS2")&lt;/script&gt;</code> გვერდი აუარე <i>client-side</i> უსაფრთხოების მექანიზმს.',
    difficulty: 3,
    hint: addHint('Only some input fields validate their input. Even less of these are persisted in a way where their content is shown on another screen.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/xss.html#perform-a-persisted-xss-attack-bypassing-a-client-side-security-mechanism'),
    solved: false
  }).success(challenge => {
    challenges.persistedXssChallengeUser = challenge
  })
  models.Challenge.create({
    name: 'XSS4',
    category: 'XSS',
    description: 'განახორციელე <i>persisted</i> XSS შეტევა შემდეგი კოდით <code>&lt;script&gt;alert("XSS4")&lt;/script&gt;</code> გვერდი აუარე <i>server-side</i> უსაფრთხოების მექანიზმს.',
    difficulty: 4,
    hint: addHint('The "Comment" field in the "Contact Us" screen is where you want to put your focus on.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/xss.html#perform-a-persisted-xss-attack-bypassing-a-server-side-security-mechanism'),
    solved: false
  }).success(challenge => {
    challenges.persistedXssChallengeFeedback = challenge
  })
  models.Challenge.create({
    name: 'XSS3',
    category: 'XSS',
    description: 'განახორციელე <i>persisted</i> XSS შეტევა შემდეგი კოდით <code>&lt;script&gt;alert("XSS3")&lt;/script&gt;</code> frontend აპლიკაციის გამოყენების გარეშ.',
    difficulty: 3,
    hint: addHint('You need to work with the server-side API directly. Try different HTTP verbs on different entities exposed through the API.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/xss.html#perform-a-persisted-xss-attack-without-using-the-frontend-application-at-all'),
    solved: false
  }).success(challenge => {
    challenges.restfulXssChallenge = challenge
  })
  models.Challenge.create({
    name: 'User Credentials',
    category: 'SQL Injection',
    description: 'SQL Injection -იით ნახე მომხმარებლების ცხრილი',
    difficulty: 3,
    hint: addHint('Craft a UNION SELECT attack string against a page where you can influence the data being displayed.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/sqli.html#retrieve-a-list-of-all-user-credentials-via-sql-injection'),
    solved: false
  }).success(challenge => {
    challenges.unionSqlInjectionChallenge = challenge
  })
  models.Challenge.create({
    name: 'Password Strength',
    category: 'Weak Security Mechanisms',
    description: 'დალოგინდი administrator -ის პაროლით.',
    difficulty: 2,
    hint: addHint('This one should be equally easy to a) brute force, b) crack the password hash or c) simply guess.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/weak-security.html#log-in-with-the-administrators-user-credentials-without-previously-changing-them-or-applying-sql-injection'),
    solved: false
  }).success(challenge => {
    challenges.weakPasswordChallenge = challenge
  })
  models.Challenge.create({
    name: 'მომხმარებელთა გამოხმაურება (Feedback)',
    category: 'Privilege Escalation',
    description: 'ადმინის პანელიდან წაშალე შველა ხუთ ვარსკვლავიანი გამოხმაურება(Feedback)',
    difficulty: 1,
    hint: addHint('Once you found admin section of the application, this challenge is almost trivial.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/privilege-escalation.html#get-rid-of-all-5-star-customer-feedback'),
    solved: false
  }).success(challenge => {
    challenges.feedbackChallenge = challenge
  })
  models.Challenge.create({
    name: 'ყალბი გამოხმაურება (Feedback)',
    category: 'Privilege Escalation',
    description: 'სხვა მომხმარებლის სახელით გააკეთე გამოხმაურება',
    difficulty: 3,
    hint: addHint('You can solve this by tampering with the user interface or by intercepting the communication with the RESTful backend.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/privilege-escalation.html#post-some-feedback-in-another-users-name'),
    solved: false
  }).success(challenge => {
    challenges.forgedFeedbackChallenge = challenge
  })
  models.Challenge.create({
    name: 'კალათზე წვდომა',
    category: 'Privilege Escalation',
    description: 'მოახდინე სხვის კალათზე წვდომა',
    difficulty: 2,
    hint: addHint('Have an eye on the HTTP traffic while shopping. Alternatively try to find s client-side association of users to their basket.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/privilege-escalation.html#access-someone-elses-basket'),
    solved: false
  }).success(challenge => {
    challenges.basketChallenge = challenge
  })
  models.Challenge.create({
    name: 'უფასოდ შეძენა',
    category: 'Validation Flaws',
    description: 'შეისყიდე პროდუქტი ისე რომ თანხა არ გადაიხადო.',
    difficulty: 3,
    hint: addHint('You literally need to make the shop owe you any amount of money.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/validation.html#place-an-order-that-makes-you-rich'),
    solved: false
  }).success(challenge => {
    challenges.negativeOrderChallenge = challenge
  })
  models.Challenge.create({
    name: 'კონფიდენციალური დოკუმენტები',
    category: 'Forgotten Content',
    description: 'განახორციელე წვდომა კონფიდენციალურ დოკუმენტებზე.',
    difficulty: 1,
    hint: addHint('Analyze and tamper with links in the application that deliver a file directly.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/forgotten-content.html#access-a-confidential-document'),
    solved: false
  }).success(challenge => {
    challenges.directoryListingChallenge = challenge
  })
  models.Challenge.create({
    name: 'დეველოპერის Backup ფაილი',
    category: 'Forgotten Content',
    description: 'განახორციელე წვდომა დეველოპერის backup ფაილზე.',
    difficulty: 3,
    hint: addHint('You need to trick a security mechanism into thinking that the file you want has a valid file type.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/forgotten-content.html#access-a-developers-forgotten-backup-file'),
    solved: false
  }).success(challenge => {
    challenges.forgottenDevBackupChallenge = challenge
  })
  models.Challenge.create({
    name: 'კუპონების ფაილი',
    category: 'Forgotten Content',
    description: 'განახორციელე კუპონების ფაილზე წვდომა.',
    difficulty: 2,
    hint: addHint('You need to trick a security mechanism into thinking that the file you want has a valid file type.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/forgotten-content.html#access-a-salesmans-forgotten-backup-file'),
    solved: false
  }).success(challenge => {
    challenges.forgottenBackupChallenge = challenge
  })
  models.Challenge.create({
    name: 'Admin -ის განყოფილება',
    category: 'Privilege Escalation',
    description: 'განახორციელე ადმინის პანელზე წვდომა.',
    difficulty: 1,
    hint: addHint('It is just slightly harder to find than the score board link.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/privilege-escalation.html#access-the-administration-section-of-the-store'),
    solved: false
  }).success(challenge => {
    challenges.adminSectionChallenge = challenge
  })
  models.Challenge.create({
    name: 'CSRF',
    category: 'CSRF',
    description: 'შეცვალე Bender-ის პაროლი <i>slurmCl4ssic</i> - ად (SQL Injection გამოყენების გარეშე).',
    difficulty: 4,
    hint: addHint('The fact that this challenge is in the CSRF category is already a huge hint.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/csrf.html#change-benders-password-into-slurmcl4ssic-without-using-sql-injection'),
    solved: false
  }).success(challenge => {
    challenges.csrfChallenge = challenge
  })
  models.Challenge.create({
    name: 'Product Tampering',
    category: 'Privilege Escalation',
    description: 'შეცვალე <code>href</code> <a href="/#/search?q=ZAP">ZAP product</a> კოდი <i>https://mozilla.com</i> -ად.',
    difficulty: 3,
    hint: addHint('Look for one of the following: a) broken admin functionality, b) holes in RESTful API or c) possibility for SQL Injection.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/privilege-escalation.html#change-the-href-of-the-link-within-the-o-saft-product-description'),
    solved: false
  }).success(challenge => {
    challenges.changeProductChallenge = challenge
  })
  models.Challenge.create({
    name: 'Vulnerable Library',
    category: 'Vulnerable Component',
    description: '<a href="/#/contact">შეატყობინე მაღაზიას</a> ბამოყენებული დაუცველი ბიბლიოთეკის შესახებ. (სახელი და ვერსია)',
    difficulty: 3,
    hint: addHint('Report one of two possible answers via the "Contact Us" form. Do not forget to submit the library\'s version as well.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/vulnerable-components.html#inform-the-shop-about-a-vulnerable-library-it-is-using'),
    solved: false
  }).success(challenge => {
    challenges.knownVulnerableComponentChallenge = challenge
  })
  models.Challenge.create({
    name: 'სუსტი კრიფტოგრაფია',
    category: 'Cryptographic Issues',
    description: '<a href="/#/contact">შეატყობინე მაღაზიას</a> გამოყენებული სუსტი კრიფტოგრაფიის ალგორითმის შესახებ ან ბიბლიოთეკის(მხოლოდ სახელი მიუთითე)',
    difficulty: 2,
    hint: addHint('Report one of four possible answers via the "Contact Us" form.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/crypto.html#inform-the-shop-about-an-algorithm-or-library-it-should-definitely-not-use-the-way-it-does'),
    solved: false
  }).success(challenge => {
    challenges.weirdCryptoChallenge = challenge
  })
  models.Challenge.create({
    name: 'Easter Egg 1',
    category: 'Forgotten Content',
    description: 'იპოვე eastere.gg ფაილი</a>.',
    difficulty: 3,
    hint: addHint('If you solved one of the three file access challenges, you already know where to find the easter egg.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/forgotten-content.html#find-the-hidden-easter-egg'),
    solved: false
  }).success(challenge => {
    challenges.easterEggLevelOneChallenge = challenge
  })
  models.Challenge.create({
    name: 'Easter Egg 2',
    category: 'Cryptographic Issues',
    description: 'გამოიკვლიე eastere.gg ფაილი',
    difficulty: 4,
    hint: addHint('You might have to peel through several layers of tough-as-nails encryption for this challenge.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/crypto.html#apply-some-advanced-cryptanalysis-to-find-the-real-easter-egg'),
    solved: false
  }).success(challenge => {
    challenges.easterEggLevelTwoChallenge = challenge
  })
  models.Challenge.create({
    name: 'თემის შეცვლა',
    category: 'Forgotten Content',
    description: 'შეცვალე თემა <img src="/css/geo-bootstrap/img/hot.gif"> ძველ სტილში.',
    difficulty: 3,
    hint: addHint('The mentioned golden era lasted from 1994 to 2009.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/forgotten-content.html#travel-back-in-time-to-the-golden-era-of-web-design'),
    solved: false
  }).success(challenge => {
    challenges.geocitiesThemeChallenge = challenge
  })
  models.Challenge.create({
    name: 'სიაში არმქონე პროდუქტი',
    category: 'SQL Injection',
    description: 'იყიდე Christmas special offer of 2014.',
    difficulty: 2,
    hint: addHint('Find out how the application handles unavailable products.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/sqli.html#order-the-christmas-special-offer-of-2014'),
    solved: false
  }).success(challenge => {
    challenges.christmasSpecialChallenge = challenge
  })
  models.Challenge.create({
    name: 'Upload Size',
    category: 'Validation Flaws',
    description: 'ატვირთე დაშვებულ 100 kB. -ზე მეტი და 200 kb -ზე ნაკლები ზომის PDF ფაილი',
    difficulty: 3,
    hint: addHint('You can attach a small file to the "File Complaint" form. Investigate how this upload actually works.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/validation.html#upload-a-file-larger-than-100-kb'),
    solved: false
  }).success(challenge => {
    challenges.uploadSizeChallenge = challenge
  })
  models.Challenge.create({
    name: 'Upload Type',
    category: 'Validation Flaws',
    description: 'ატვირთე არა .pdf გაფართოების ფაილი.',
    difficulty: 3,
    hint: addHint('You can attach a PDF file to the "File Complaint" form. Investigate how this upload actually works.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/validation.html#upload-a-file-that-has-no-pdf-extension'),
    solved: false
  }).success(challenge => {
    challenges.uploadTypeChallenge = challenge
  })
  models.Challenge.create({
    name: 'ურეიტინგო გამოხმაურება',
    category: 'Validation Flaws',
    description: 'გააკეთე გამოხმაურება ვარსკვლავების მითითების გარეშე',
    difficulty: 1,
    hint: addHint('Before you invest time bypassing the API, you might want to play around with the UI a bit.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/validation.html#give-a-devastating-zero-star-feedback-to-the-store'),
    solved: false
  }).success(challenge => {
    challenges.zeroStarsChallenge = challenge
  })
  models.Challenge.create({
    name: 'დაარესეტე Jim -ის პაროლი',
    category: 'Sensitive Data Exposure',
    description: 'დაარესეტე James T. Kirk -ის პაროლი <a href="/#/forgot-password">Forgot Password</a>  უსაფრთხოების კითხვის გამოცნობის ხარჯზე. (გამოიყენე OSINT)',
    difficulty: 2,
    hint: addHint('It\'s hard for celebrities to pick a security question from a hard-coded list where the answer is not publicly exposed.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/sensitive-data.html#reset-jims-password-via-the-forgot-password-mechanism'),
    solved: false
  }).success(challenge => {
    challenges.resetPasswordJimChallenge = challenge
  })
  models.Challenge.create({
    name: 'დაარესეტე Bender -ის პაროლი',
    category: 'Sensitive Data Exposure',
    description: 'დაარესეტე Bender -ის პაროლი (Bender from Futurama) <a href="/#/forgot-password">Forgot Password</a> უსაფრთხოების კითხვის გამოცნობის ხარჯზე. (გამოიყენე OSINT).',
    difficulty: 3,
    hint: addHint('Not as trivial as Jim\'s but still not too difficult with some "Futurama" background knowledge.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/sensitive-data.html#reset-benders-password-via-the-forgot-password-mechanism'),
    solved: false
  }).success(challenge => {
    challenges.resetPasswordBenderChallenge = challenge
  })
  models.Challenge.create({
    name: 'NoSQL Injection Tier 2',
    category: 'NoSQL Injection',
    description: 'Update multiple product reviews at the same time.',
    hint: addHint('Take a close look on how the equivalent of UPDATE-statements in MongoDB work.'),
    difficulty: 3,
    solved: false
  }).success(challenge => {
    challenges.noSqlInjectionChallenge = challenge
  })
  models.Challenge.create({
    name: '3D მოდელი',
    category: 'Forgotten Content',
    description: 'მოიპოვე firefox -ის ემბლემის stl ფაილი',
    difficulty: 3,
    hint: addHint('Property \'fileForRetrieveBlueprintChallenge\' is missing in your Juice Shop config! Workaround: Try finding \'JuiceShop.stl\' somewhere. Be aware that with v5.0 this workaround will be removed!'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/forgotten-content.html#deprive-the-shop-of-earnings-by-downloading-the-blueprint-for-one-of-its-products'),
    solved: false
  }).success(challenge => {
    challenges.retrieveBlueprintChallenge = challenge

    // TODO remove this workaround default before v5.0 release
    for (const product of config.get('products')) {
      if (product.fileForRetrieveBlueprintChallenge) {
        models.sequelize.query('UPDATE Challenges SET hint = \'The product you might want to give a closer look is the ' + product.name + '.\' WHERE id = ' + challenge.id)
        break
      }
    }
  })
  models.Challenge.create({
    name: 'Typosquatting 1',
    category: 'Vulnerable Component',
    description: '<a href="/#/contact">შეატყობინე მაღაზიას</a> <i>typosquatting</i> ხრიკის შესახებ, რომლის მსხვერპლიც არის. (მიშერე ყალბი პაკეტის სახელი)',
    difficulty: 3,
    hint: addHint('This challenge has nothing to do with URLs or domains. Investigate the forgotten developer\'s backup file instead.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/vulnerable-components.html#inform-the-shop-about-a-typosquatting-trick-it-has-become-victim-of'),
    solved: false
  }).success(challenge => {
    challenges.typosquattingNpmChallenge = challenge
  })
  models.Challenge.create({
    name: 'Typosquatting 2',
    category: 'Vulnerable Component',
    description: '<a href="/#/contact">შეატყობინე მაღაზიას</a> ფრონტში გამოყენებული <i>typosquatting</i> ხრიკის შესახებ, რომლის მსხვერპლიც არის. (მიშერე ყალბი პაკეტის სახელი)',
    difficulty: 4,
    hint: addHint('This challenge has nothing to do with URLs or domains. It literally exploits a potentially common typo.'),
    hintUrl: addHint('https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part2/vulnerable-components.html#inform-the-shop-about-a-more-literal-instance-of-typosquatting-it-fell-for'),
    solved: false
  }).success(challenge => {
    challenges.typosquattingBowerChallenge = challenge
  })
}

function createUsers () {
  models.User.create({
    email: 'admin@' + config.get('application.domain'),
    password: 'admin123'
  })
  models.User.create({
    email: 'jim@' + config.get('application.domain'),
    password: 'ncc-1701'
  })
  models.User.create({
    email: 'bender@' + config.get('application.domain'),
    password: 'OhG0dPlease1nsertLiquor!'
  }).success(user => {
    users.bender = user
  })
  models.User.create({
    email: 'psiinon@gmail.com',
    password: 'cHNpaW5vbkBnbWFpbC5jb20='
  }).success(user => {
    users.psiinon = user
  })
  models.User.create({
    email: 'ciso@' + config.get('application.domain'),
    password: 'mDLx?94T~1CfVfZMzw@sJ9f?s3L6lbMqE70FfI8^54jbNikY5fymx7c!YbJb'
  }).success(user => {
    users.ciso = user
  })
  models.User.create({
    email: 'support@' + config.get('application.domain'),
    password: 'J6aVjTgOpRs$?5l+Zkq2AYnCE@RF§P'
  }).success(user => {
    users.support = user
  })
}

function createRandomFakeUsers () {
  for (let i = 0; i < config.get('application.numberOfRandomFakeUsers'); i++) {
    models.User.create({
      email: getGeneratedRandomFakeUserEmail(),
      password: makeRandomString(5)
    })
  }
}

function getGeneratedRandomFakeUserEmail () {
  const randomDomain = makeRandomString(4).toLowerCase() + '.' + makeRandomString(2).toLowerCase()
  return makeRandomString(5).toLowerCase() + '@' + randomDomain
}

function makeRandomString (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}

function createProducts () {
  function softDeleteIfConfigured (product) {
    for (const configuredProduct of config.get('products')) {
      if (product.name === configuredProduct.name) {
        if (configuredProduct.deletedDate) {
          models.sequelize.query('UPDATE Products SET deletedAt = \'' + configuredProduct.deletedDate + '\' WHERE id = ' + product.id)
        }
        break
      }
    }
  }

  for (const product of config.get('products')) {
    const name = product.name
    let description = product.description || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
    const reviews = product.reviews
    if (product.useForChristmasSpecialChallenge) {
      description += ' (Seasonal special offer! Limited availability!)'
    } else if (product.useForProductTamperingChallenge) {
      description += ' <a href="https://www.owasp.org/index.php/ZAP" target="_blank">More...</a>'
    } else if (product.fileForRetrieveBlueprintChallenge) {
      let blueprint = product.fileForRetrieveBlueprintChallenge
      if (utils.startsWith(blueprint, 'http')) {
        const blueprintUrl = blueprint
        blueprint = decodeURIComponent(blueprint.substring(blueprint.lastIndexOf('/') + 1))
        utils.downloadToFile(blueprintUrl, 'app/public/images/products/' + blueprint)
      }
      datacache.retrieveBlueprintChallengeFile = blueprint
    }
    const price = product.price || Math.floor(Math.random())
    let image = product.image || 'undefined.png'
    if (utils.startsWith(image, 'http')) {
      const imageUrl = image
      image = decodeURIComponent(image.substring(image.lastIndexOf('/') + 1))
      utils.downloadToFile(imageUrl, 'app/public/images/products/' + image)
    }
    models.Product.create({
      name: name,
      description: description,
      price: price,
      image: image
    }).success(product => {
      softDeleteIfConfigured(product)
      if (product.description.match(/Seasonal special offer! Limited availability!/)) {
        products.christmasSpecial = product
        models.sequelize.query('UPDATE Products SET deletedAt = \'2014-12-27 00:00:00.000 +00:00\' WHERE id = ' + product.id)
      } else if (product.description.match(/a href="https:\/\/www\.owasp\.org\/index\.php\/ZAP"/)) {
        products.zap = product
        if (product.deletedAt) { // undo delete to be consistent about corresponding challenge difficulty
          models.sequelize.query('UPDATE Products SET deletedAt = null WHERE id = ' + product.id)
        }
      }
      return product
    }).success(product => {
      if (reviews) {
        return Promise.all(
          reviews
          .map((review) => {
            review.message = review.text
            review.author = review.author + '@' + config.get('application.domain')
            review.product = product.id
            return review
          }).map((review) => {
            return mongodb.reviews.insert(review)
          })
        )
      }
    })
  }

  if (!datacache.retrieveBlueprintChallengeFile) { // TODO remove this workaround default before v5.0 release
    datacache.retrieveBlueprintChallengeFile = 'JuiceShop.stl'
  }
}

function createBaskets () {
  models.Basket.create({
    UserId: 1
  })
  models.Basket.create({
    UserId: 2
  })
  models.Basket.create({
    UserId: 3
  })
  models.BasketItem.create({
    BasketId: 1,
    ProductId: 1,
    quantity: 2
  })
  models.BasketItem.create({
    BasketId: 1,
    ProductId: 2,
    quantity: 3
  })
  models.BasketItem.create({
    BasketId: 1,
    ProductId: 3,
    quantity: 1
  })
  models.BasketItem.create({
    BasketId: 2,
    ProductId: 4,
    quantity: 2
  })
  models.BasketItem.create({
    BasketId: 3,
    ProductId: 5,
    quantity: 1
  })
}

function createFeedback () {
  models.Feedback.create({
    UserId: 1,
    comment: 'I love this shop! Best products in town! Highly recommended!',
    rating: 5
  })
  models.Feedback.create({
    UserId: 2,
    comment: 'Great shop! Awesome service!',
    rating: 4
  })
  models.Feedback.create({
    comment: 'Incompetent customer support! Can\'t even upload photo of broken purchase!<br><em>Support Team: Sorry, only order confirmation PDFs can be attached to complaints!</em>',
    rating: 2
  })
  models.Feedback.create({
    comment: 'This is <b>the</b> store for awesome stuff of all kinds!',
    rating: 4
  })
  models.Feedback.create({
    comment: 'Never gonna buy anywhere else from now on! Thanks for the great service!',
    rating: 4
  })
  models.Feedback.create({
    comment: 'Keep up the good work!',
    rating: 3
  })
  models.Feedback.create({
    UserId: 3,
    comment: 'Nothing useful available here!',
    rating: 1
  })
}

function createComplaints () {
  models.Complaint.create({
    UserId: 3,
    message: 'I\'ll build my own eCommerce business! With Black Jack! And Hookers!'
  })
}

function createRecycles () {
  models.Recycle.create({
    UserId: 2,
    quantity: 800,
    address: 'Starfleet HQ, 24-593 Federation Drive, San Francisco, CA',
    date: '2270-01-17',
    isPickup: true
  })
}

function createSecurityQuestions () {
  models.SecurityQuestion.create({
    question: 'Your eldest siblings middle name?'
  })
  models.SecurityQuestion.create({
    question: 'Mother\'s maiden name?'
  })
  models.SecurityQuestion.create({
    question: 'Mother\'s birth date? (MM/DD/YY)'
  })
  models.SecurityQuestion.create({
    question: 'Father\'s birth date? (MM/DD/YY)'
  })
  models.SecurityQuestion.create({
    question: 'Maternal grandmother\'s first name?'
  })
  models.SecurityQuestion.create({
    question: 'Paternal grandmother\'s first name?'
  })
  models.SecurityQuestion.create({
    question: 'Name of your favorite pet?'
  })
  models.SecurityQuestion.create({
    question: 'Last name of dentist when you were a teenager? (Do not include \'Dr.\')'
  })
  models.SecurityQuestion.create({
    question: 'Your ZIP/postal code when you were a teenager?'
  })
  models.SecurityQuestion.create({
    question: 'Company you first work for as an adult?'
  })
}

function createSecurityAnswers () {
  models.SecurityAnswer.create({
    SecurityQuestionId: 2,
    UserId: 1,
    answer: '@xI98PxDO+06!'
  })
  models.SecurityAnswer.create({
    SecurityQuestionId: 1,
    UserId: 2,
    answer: 'Samuel' // https://en.wikipedia.org/wiki/James_T._Kirk
  })
  models.SecurityAnswer.create({
    SecurityQuestionId: 10,
    UserId: 3,
    answer: 'Stop\'n\'Drop' // http://futurama.wikia.com/wiki/Suicide_booth
  })
  models.SecurityAnswer.create({
    SecurityQuestionId: 9,
    UserId: 4,
    answer: 'West-2082' // http://www.alte-postleitzahlen.de/uetersen
  })
  models.SecurityAnswer.create({
    SecurityQuestionId: 7,
    UserId: 5,
    answer: 'Brd?j8sEMziOvvBf§Be?jFZ77H?hgm'
  })
  models.SecurityAnswer.create({
    SecurityQuestionId: 10,
    UserId: 6,
    answer: 'SC OLEA SRL' // http://www.olea.com.ro/
  })
}
