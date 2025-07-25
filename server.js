const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { getMissingFields } = require('./utils/profileCheck');
const BoostRequest = require('./models/BoostRequest');
const mongoose = require('mongoose');
const Escort = require('./models/Escorts');
const ProfileView = require('./models/profileviews');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const NodeCache = require('node-cache');
const compression = require('compression');
app.use(compression()); //Compress responses to reduce payload size and speed up delivery:
app.set('trust proxy', true); // Trust upstream proxy to correctly identify protocol (e.g., http vs https)


const escortCache = new NodeCache({ stdTTL: 1500 }); // 25 minutes = 1500 seconds
const homeCache = new NodeCache({ stdTTL: 40, checkperiod: 5})
const profileCache = new NodeCache({ stdTTL: 40, checkperiod: 5 });

// Limit: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Try again later.'
  },
  standardHeaders: true, // Send rate limit info via headers
  legacyHeaders: false,  // Disable deprecated headers
});


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb', extended: true}));

app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secure: false, // Set to true if using HTTPS
        httpOnly: true ,// Prevents client-side JavaScript from accessing the cookie
        sameSite: 'strict' // Helps prevent CSRF attacks
    }
    }))
    app.use((req, res, next)=> {
        res.locals.loggedInEscort = req.session.escort || null;
        next();
    })



const PORT = 3000;

    // Now it's safe to use your model

const escorts = [
{
"name": "Sally",
"weight": "76",
  "gender": "Female",
  "allowedtopost": "true",
  "publishedAt": "2025-04-09",
  "email": "wanjiku@escort.com",
  "location": "Nairobi CBD",
  "city": "Nairobi",
  "password": "clinton123@()",
  "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2025/06/image-477474-420x420-200x200.jpeg",
  "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
  "phone": "0742389828",
  "dob": "1998-03-01",
  "gallery": [],
  "orientation": "straight",
  "socialLinka": "",
  "services": []
},
{
"name": "Samira",
  "gender": "Female",
  "allowedtopost": "true",
  "publishedAt": "2025-04-09",
  "weight": "80",
  "email": "Fifi@escort.com",
  "location": "Nairobi West",
  "city": "Nairobi",
  "password": "clinton123@()",
  "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2025/07/image-478330-420x420-200x200.jpeg",
  "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
  "phone": "0719396761",
  "dob": "2001-03-01",
  "gallery": [],
  "orientation": "straight",
  "socialLinka": "",
  "services": []
},
{
"name": "Zuri",
"gender": "Female",
"allowedtopost": "true",
  "publishedAt": "2025-04-09",
  "weight": "86",
  "email": "leilah@escort.com",
  "location": "Nairobi West",
  "city": "Nairobi",
  "password": "clinton123@()",
  "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2025/04/image-476182-420x420-200x200.jpeg",
  "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
  "phone": "0713172293",
  "dob": "2004-03-01",
  "gallery": [],
  "orientation": "straight",
  "socialLinka": "",
  "services": []
},
{
"name": "Belly",
"gender": "Female",
"allowedtopost": "true",
  "publishedAt": "2025-04-09",
  "email": "wahukelly@escort.com",
  "location": "CBD",
  "city": "Nairobi",
  "password": "clinton123@()",
  "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2025/07/image-478413-420x420-200x200.jpg",
  "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
  "phone": "0729677559",
  "dob": "1985-03-01",
  "gallery": [],
  "orientation": "straight",
  "weight": "93",
  "socialLinka": "",
  "services": []
},
{
"name": "RINA",
"gender": "Female",
"allowedtopost": "true",
  "publishedAt": "2025-04-09",
  "weight": "99",
  "email": "jessica@escort.com",
  "location": "CBD",
  "city": "Nairobi",
  "password": "clinton123@()",
  "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2025/07/image-478491-200x200.jpg",
  "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
  "phone": "0720493795",
  "dob": "1982-03-01",
  "gallery": [],
  "orientation": "straight",
  "socialLinka": "",
  "services": []
},
{
"name": "Natasha",
"gender": "Female",
"allowedtopost": "true",
  "publishedAt": "2025-04-09",
  "weight": "83",
  "email": "joo@escort.com",
  "location": "CBD",
  "city": "Nairobi",
  "password": "clinton123@()",
  "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2024/12/image-474054-200x200.jpg",
  "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
  "phone": "0756982493",
  "dob": "1990-03-01",
  "gallery": [],
  "orientation": "straight",
  "socialLinka": "",
  "services": []
}]
// {
// "name": "amryn",
// "gender": "Female",
//   "weight": "97",
//   "allowedtopost": "true",
//   "publishedAt": "2025-04-09",
//   "email": "amryn@escort.com",
//   "location": "Nakuru Town",
//   "city": "Nakuru",
//   "password": "clinton123@()",
//   "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2025/06/image-477384-420x420-200x200.jpeg",
//   "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
//   "phone": "0756982493",
//   "dob": "1987-03-01",
//   "gallery": [],
//   "orientation": "straight",
//   "socialLinka": "",
//   "services": []
// },
// {
// "name": "natasha",
// "gender": "Female",
//   "weight": "82",
//   "allowedtopost": "true",
//   "publishedAt": "2025-04-09",
//   "email": "natasha@escort.com",
//   "location": "Kisumu Town",
//   "city": "Kisumu",
//   "password": "clinton123@()",
//   "userImg": "https://www.nairobiraha.co.ke/wp-content/uploads/2024/12/image-474054-200x200.jpg",
//   "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
//   "phone": "0756982493",
//   "dob": "1992-03-01",
//   "gallery": [],
//   "orientation": "straight",
//   "socialLinka": "",
//   "services": []
// },
// {
// "name": "Bianca",
// "gender": "Female",
//   "weight": "75",
//   "allowedtopost": "true",
//   "publishedAt": "2025-04-09",
//   "email": "bianca@escort.com",
//   "location": "Eldoret Town",
//   "city": "Eldoret",
//   "password": "clinton123@()",
//   "userImg": "https://www.exotickenya.com/wp-content/uploads/1747143049745/17514433414733.jpg",
//   "about": "This is Fifi., She is a hot 25 years old Burundian escort in Yaya Centre. She offers the best Dinner Date, Travel Companion, Lesbian Show, Rimming, Raw BJ, BJ, GFE – Girlfriend Experience, COB – Cum On Body, CIM – Cum In Mouth, 3 Some, Anal, Massage in Kilimani . To communicate with Fifi. you can Contact her through her Number 0723044007 to arrange a meetup. So if you are looking for a nice 3 Some or Just Lesbian Show service then Fifi. is your ideal escort.",
//   "phone": "0756982493",
//   "dob": "2001-03-01",
//   "gallery": [],
//   "orientation": "straight",
//   "socialLinka": "",
//   "services": []
// }]


let mongoConnected = false;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    mongoConnected = true;
//     async function verifyEmail(email) {
//       try {
//         const result = await Escort.updateOne(
//           { email: email.trim().toLowerCase() },
//           { $set: { isVerified: true } }
//         );
//         console.log('Update result:', result);
//       } catch (err) {
//         console.error('Update failed:', err);
//       }
//     }

//     verifyEmail('muneneclinton797@gmail.com');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    mongoConnected = false;
    setTimeout(startServer, 10000); // backoff retry
  }
}

// const collectionsToClear = ['profiles', 'profileviews', 'escorts', 'boostrequests']; // Add your collection names

// mongoose.connection.once('open', async () => {
//   console.log('Connected to MongoDB');

//   try {
//     for (const name of collectionsToClear) {
//       const collection = mongoose.connection.collections[name];
//       if (collection) {
//         await collection.deleteMany({});
//         console.log(`Cleared collection: ${name}`);
//       } else {
//         console.log(`Collection not found: ${name}`);
//       }
//     }
//   } catch (err) {
//     console.error('Error clearing collections:', err);
//   } finally {
//     mongoose.connection.close();
//   }
// });

// Start server outside the Mongo connection
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  startServer(); // attempt MongoDB connection after Express is up
});

// Example: Find a profile
// const g = await Escort.findOne({ s: 'Sheila Starlight' });
// const l = await Escort.findOne({ d: req.session.escort.email });

// Example: Create a new profile
// const newEscort = new Escort({
//     name: 'New Escort',
//     email: '',
//     location: 'Nairobi',
//     age: 25,
//     password: 'password123',
       
//     userImg: 'https://example.com/image.jpg',
//     about: 'This is a new escort profile.',
//     location: 'Nairobi',
//     gallery: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
//     phone: '1234567890',
//     socialLinks: {
//         instagram: 'https://instagram.com/newescort',
//         twitter: 'https://twitter.com/newescort',
//         facebook: 'https://facebook.com/newescort',
//         tiktok: 'https://tiktok.com/@newescort',
//     },
//     services: 'Massage, Companionship',
//     availability: 'Available 24/7',
//     ratings: 0,
//     reviews: 0,
//     isVerified: false,
//     isOnline: false,
//     isActive: true,
//     isPremium: false,
// }).save();


// Example: Save updates
// escort.location = req.body.location
// await escort.save()
// Escort.createIndexes({ name: 1 });
// Escort.createIndexes({ city: 1 });
// ProfileView.createIndexes({ profile: 1 });
// server.js (or wherever you configure your app)
const PRICING = {
  'bronze-weekly': 100,
  'silver-weekly': 200,
  'gold-weekly': 300,
  'bronze-monthly': 400,
  'silver-monthly': 800,
  'gold-monthly': 1200
};

const orderRank = { gold: 3, silver: 2, bronze: 1, null: 0 };

const getPureTier = (boostType = '') => {
  const parts = boostType.split('-');
  return parts[0]; // 'gold', 'silver', or 'bronze'
};

app.get('/health', (req, res) => {
  console.log('server is awake now (*_*)')
  res.status(200).json({ status: 'awake' });
});

app.get('/boost-request', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'boostform.html'));
})
app.post('/boost-request', async (req, res) => {
  try {
    const { boostType, location, mpesaRef } = req.body;
    const pricePaid = PRICING[boostType] || 0;
    const escortId  = req.session?.escort?.id || "anonymous";

    const request = new BoostRequest({
      escort:     escortId,
      name: req.session?.escort?.name || null,
      boostType,
      pricePaid,         // ← record the actual cost
      location,
      mpesaRef,
      status:     "pending",
      timestamp:  new Date()
    });

    await request.save();
    res.send("Boost request received. Confirmation will follow.");
  }
  catch (err) {
    console.error(err);
    res.status(500).send("Error processing request.");
  }
});

function isAdmin(req, res, next) {
  if (req.session?.escort?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
}
app.get('/admin', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'adminDashboard.html'));
});

app.get('/admin/users', async (req, res) => {
  try {
  const users = await Escort.find({}).select('name email role isVerified');
  res.status(200).json(users)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to load users' });
  }
  
})

app.post('/admin/approve-boost/:id', isAdmin, async (req, res) => {
  try {
    const boost = await BoostRequest.findById(req.params.id);
    if (!boost) return res.status(404).send("Boost request not found.");

    // 🧠 Parse duration from boostType (e.g. 'gold-weekly' or 'silver-monthly')
    const [tier, duration] = boost.boostType?.split('-') || [];

    // ⏳ Determine expiration period
    let durationDays = 7; // default
    if (duration === 'monthly') durationDays = 30;
    else if (duration === 'weekly') durationDays = 7;

    // 🗓️ Approve and set expiry
    boost.status = 'confirmed';
    boost.expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    await boost.save();

    res.json({
      success: true,
      message: `Boost confirmed (${tier}, ${duration}) and expires in ${durationDays} days.`
    });

  } catch (err) {
    console.error('Error approving boost:', err);
    res.status(500).json({ success: false, error: 'Server error during boost approval.' });
  }
});


app.get('/admin/boosts', async (req, res) => {
  try {
    const boostedUsers = await BoostRequest.find({ status: 'pending' })
      .select('escort name timestamp mpesaRef status expiresAt boostType')
      .lean();

    const now = new Date();
    const formatted = boostedUsers.map(b => {
      const [tier, duration] = b.boostType?.split('-') || ['N/A', 'N/A'];
      return {
        ...b,
        tier,
        duration,
        daysRemaining: b.expiresAt
          ? Math.max(0, Math.ceil((new Date(b.expiresAt) - now) / (1000 * 60 * 60 * 24)))
          : '—'
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});
 
app.get('/escorts-from-:area', async (req, res) => {
  const area = req.params.area;

  try {
    const escortEmail = req.session?.escort?.email;
    const escort = escortEmail ? await Escort.findOne({ email: escortEmail }) : null;
    const escorts = await Escort.find({
      location: { $regex: new RegExp(area, 'i') },
      allowedtopost: true
    }).lean();

    const boosts = await BoostRequest.find({
      status: 'confirmed',
      expiresAt: { $gt: new Date() }
    }).select('escort boostType').lean();

    const boostMap = boosts.reduce((map, b) => {
      map[b.escort.toString()] = b.boostType;
      return map;
    }, {});

    const ranked = escorts.map(e => {
      let age = null;
      if (e.dob) {
        const bd = new Date(e.dob), today = new Date();
        age = today.getFullYear() - bd.getFullYear();
        const m = today.getMonth() - bd.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
      }
      return {
        ...e,
        age,
        isBoosted: Boolean(boostMap[e._id.toString()]),
        boostType: boostMap[e._id.toString()] || null
      };
    });

    const boosted = ranked.filter(e => e.isBoosted).sort(
      (a, b) => orderRank[getPureTier(b.boostType)] - orderRank[getPureTier(a.boostType)]
    );

    const normal = ranked.filter(e => !e.isBoosted);
    for (let i = normal.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [normal[i], normal[j]] = [normal[j], normal[i]];
    }

    const finalList = [...boosted, ...normal];

    if (!finalList.length) {
      return res.render('index', {
        escorts: [],
        loggedInEscort: escort,
        message: `No profiles in ${area} yet.`,
        meta: metData(req),
        city: 'Nairobi'
      });
    }

    res.render('index', {
      escorts: finalList,
      loggedInEscort: escort,
      message: null,
      meta: metData(req),
      city: 'Nairobi'
    });

  } catch (err) {
    console.error(`Error fetching from ${area}:`, err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/areas-with-counts', async (req, res) => {
  console.log(`[${new Date().toISOString()}] Home route hit by ${req.ip}`);
  const location = {
    Nairobi: [
      "Kilimani", "Westlands", "Karen", "CBD", "Roysambu", "Ngara", "Donholm", "Nairobi West", "Dandora", "Ojijo", "Yaya", "Sarit",
      "Ruaka", "Syokimau", "Kitengela", "Embakasi", "South B", "South C", "Lavington", "Parklands"
    ],
    Kiambu: [
      "Juja", "Kikuyu", "Ruiru", "Githurai",
      "Thika", "Limuru", "Kabete", "Tigoni"
    ]}
    // : [
    //   "Diani", "Nyali", "Likoni",
    //   "Mtwapa", "Bamburi", "Shanzu", "Kisauni"]}
  //   ]}
  //   Nakuru: [
  //     "Naivasha", "Nakuru Town", "Gilgil",
  //     "Lanet", "Njoro", "Pipeline", "Kabarak"
  //   ],
  //   Kisumu: [
  //     "Kisumu Town", "Milimani", "Riat Hills", "Mamboleo", "Manyatta"
  //   ],
  //   Eldoret: [
  //     "Eldoret Town", "Langas", "Kapsoya", "Elgon View", "Annex", "Pioneer"
  //   ],
  //   Machakos: [
  //     "Athi River", "Kangundo", "Joska", "Mwala", "Syokimau"
  //   ],
  //   Laikipia: [
  //     "Nanyuki", "Rumuruti", "Timau"
  //   ],
  //   Kajiado: [
  //     "Ongata Rongai", "Kitengela", "Ngong", "Kiserian"
  //   ],
  //   Kilifi: [
  //     "Kilifi Town", "Malindi", "Watamu", "Mtwapa"
  //   ],
  //   UasinGishu: [
  //     "Eldoret", "Turbo", "Moiben"
  //   ],
  //   Kisii: [
  //     "Kisii Town", "Nyanchwa", "Suneka"
  //   ],
  //   Kakamega: [
  //     "Kakamega Town", "Shinyalu", "Lurambi"
  //   ]
  // };

    const resultEntries = await Promise.all(
    Object.entries(location).map(async ([city, areas]) => {
      const areaCounts = await Promise.all(
        areas.map(async (area) => {
          const count = await Escort.countDocuments({
            location: new RegExp(area, 'i'),
            allowedtopost: true
          });
          return { name: area, count };
        })
      );
      return [city, areaCounts];
    })
  );

  const result = Object.fromEntries(resultEntries);

  res.json(result);
});

const DEFAULT_IMAGE = 'https://storge.pic2.me/c/1360x800/717/55661ae60b86a.jpg';

app.get('/author/:name', async (req, res) => {
  const username = req.params.name;
  if (!username) {
    return res.status(400).json({ error: 'Profile name is required' });
  }

  try {
    const escortEmail = req.session?.escort?.email;
    const author = escortEmail ? await Escort.findOne({ email: escortEmail }) : null;
    const cacheKey = `profile_${username}`;
    let cached = profileCache.get(cacheKey);
    let escort, similarEscorts;

    if (cached) {
      escort = cached.escort;
      similarEscorts = cached.similarEscorts;
    } else {
      const doc = await Escort.findOne({ name: username, allowedtopost: true }).lean();
      if (!doc) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      if (doc.dob) {
        const today = new Date();
        const bd = new Date(doc.dob);
        let age = today.getFullYear() - bd.getFullYear();
        const m = today.getMonth() - bd.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
        doc.age = age;
      }

      if (typeof doc.weight === 'string') {
        doc.weight = Number(doc.weight);
      }

      doc.userImg = doc.userImg?.trim() || DEFAULT_IMAGE;
      doc.backgroundImg = doc.backgroundImg?.trim() || DEFAULT_IMAGE;
      doc.about = doc.about?.trim() || 'No bio available.';
      escort = doc;

      const cityRegex = new RegExp(escort.city, 'i');
      const locationRegex = new RegExp(escort.location, 'i');

      const candidates = await Escort.find({
        allowedtopost: true,
        _id: { $ne: escort._id },
        city: cityRegex,
        location: locationRegex
      }).select('name userImg city location gender dob weight backgroundImg services').lean();

      const candidateIds = candidates.map(c => c._id);
      const boosts = await BoostRequest.find({
        status: 'confirmed',
        expiresAt: { $gt: new Date() },
        escort: { $in: candidateIds }
      }).select('escort boostType').lean();

      const boostMap = boosts.reduce((map, b) => {
        map[b.escort.toString()] = b.boostType;
        return map;
      }, {});

      const boostedArr = [], normalArr = [];

      candidates.forEach(c => {
        if (c.dob) {
          const today = new Date();
          const bd = new Date(c.dob);
          let age = today.getFullYear() - bd.getFullYear();
          const m = today.getMonth() - bd.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
          c.age = age;
        }

        if (typeof c.weight === 'string') {
          c.weight = Number(c.weight);
        }

        c.userImg = c.userImg?.trim() || DEFAULT_IMAGE;
        c.backgroundImg = c.backgroundImg?.trim() || DEFAULT_IMAGE;
        c.about = c.about?.trim() || 'No bio available.';

        c.isBoosted = Boolean(boostMap[c._id.toString()]);
        c.boostType = boostMap[c._id.toString()] || null;

        (c.isBoosted ? boostedArr : normalArr).push(c);
      });

      boostedArr.sort((a, b) =>
        orderRank[getPureTier(b.boostType)] - orderRank[getPureTier(a.boostType)]
      );

      for (let i = normalArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [normalArr[i], normalArr[j]] = [normalArr[j], normalArr[i]];
      }

      similarEscorts = [...boostedArr, ...normalArr].slice(0, 4);

      profileCache.set(cacheKey, { escort, similarEscorts });
    }

    const viewerIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    await ProfileView.findOneAndUpdate(
      { profile: escort._id, ipAddress: viewerIp },
      { $setOnInsert: { viewedAt: new Date() } },
      { upsert: true, new: true }
    );

    const totalViews = await ProfileView.countDocuments({ profile: escort._id });
    escort.totalViews = totalViews;

    res.render('profile', { escort, similarEscorts, loggedInEscort: author });

  } catch (err) {
    console.error('Error in /author/:name route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/settings', (req, res) => {
    if (!req.session?.escort) {
    return res.redirect('/login'); // or show error
  }
  const escort = req.session.escort;
  res.render('escortAnalytics', { escort });
});

app.get('/analytics/:escortId', async (req, res) => {
  const { escortId } = req.params;
  const { start, end } = req.query;

  if (req.session.escort.id !== escortId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
// In your ProfileView schema:

if (!start || !end || isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
  return res.status(400).json({ error: 'Valid start and end dates required.' });
}

  try {
    const views = await ProfileView.aggregate([
      {
        $match: {
          profile: new mongoose.Types.ObjectId(escortId),
          viewedAt: { $gte: new Date(start), $lte: new Date(end) }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$viewedAt" },
            month: { $month: "$viewedAt" },
            year: { $year: "$viewedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);
    console.log(views);

    res.json({ views });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

const nearbyCache = new NodeCache({ stdTTL: 1800 }); // 30 mins

app.get('/nearby', async (req, res) => {
  const { lat, lng, distance = 5000 } = req.query;
  const cacheKey = `nearby_${lat}_${lng}_${distance}`;

  const cached = nearbyCache.get(cacheKey);
  if (cached) return res.json({ success: true, escorts: cached });

  try {
    const escorts = await Escort.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    }).lean();

    nearbyCache.set(cacheKey, escorts);
    res.json({ success: true, escorts });
  } catch (err) {
    console.error('Nearby search error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch nearby escorts.' });
  }
});

app.get('/city/:name', async (req, res) => {
  const gender = req.query.gender;
  const city = req.params.name;

  if (!mongoConnected) {
    return res.status(503).render('index', {
      escorts: [],
      message: 'Service temporarily unavailable.',
      city,
      meta: metData(req)
    });
  }

  if (!city || !gender) {
    return res.status(400).render('index', {
      escorts: [],
      message: 'Missing filter.',
      city,
      meta: metData(req)
    });
  }

  try {
      const escortEmail = req.session?.escort?.email;
      const escort = escortEmail ? await Escort.findOne({ email: escortEmail }) : null;
      let escorts = await Escort.find({
      allowedtopost: true,
      city: { $regex: new RegExp(`^${city}$`, 'i') },
      gender: { $regex: new RegExp(`^${gender}$`, 'i') }
    }).lean();

    const boosts = await BoostRequest.find({
      status: 'confirmed',
      expiresAt: { $gt: new Date() }
    }).select('escort boostType').lean();

    const boostMap = boosts.reduce((map, b) => {
      map[b.escort.toString()] = b.boostType;
      return map;
    }, {});

    escorts = escorts
      .filter(e => e.about && e.userImg && e.name && e.location)
      .map(e => {
        let age = null;
        if (e.dob) {
          const bd = new Date(e.dob);
          const today = new Date();
          age = today.getFullYear() - bd.getFullYear();
          const m = today.getMonth() - bd.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
        }
        return {
          ...e,
          age,
          isBoosted: Boolean(boostMap[e._id.toString()]),
          boostType: boostMap[e._id.toString()] || null
        };
      });

    const boosted = escorts
      .filter(e => e.isBoosted)
      .sort((a, b) => orderRank[getPureTier(b.boostType)] - orderRank[getPureTier(a.boostType)]);

    const normal = escorts.filter(e => !e.isBoosted);
    for (let i = normal.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [normal[i], normal[j]] = [normal[j], normal[i]];
    }

    const finalList = [...boosted, ...normal];

    if (!finalList.length) {
      return res.render('index', {
        escorts: [],
        loggedInEscort: escort || null,
        message: 'No verified profiles match that filter.',
        city,
        meta: metData(req)
      });
    }

    res.render('index', {
      escorts: finalList,
      loggedInEscort: escort || null,
      city,
      gender,
      message: null,
      meta: {
        title: `Profiles in ${city} for ${gender} | YourSite.com`,
        description: `Explore verified ${gender.toLowerCase()} profiles available in ${city}.`,
        image: finalList[0]?.userImg || '/default-preview.jpg',
        url: req.protocol + '://' + req.get('host') + req.originalUrl
      }
    });

  } catch (err) {
    console.error('Error in /city/:name route:', err);
    res.status(500).render('index', {
      escorts: [],
      message: 'Server error while filtering.'
    });
  }
});

app.get('/register', (req, res)=> {
    res.sendFile(path.join(__dirname, 'register.html'));
})

app.post('/register', async (req, res) => {
  let escort = req.body;
  
  try {
    const escortExists = await Escort.findOne({ email: escort.email.trim().toLowerCase() });

    if (escortExists) {
      return res.status(400).json({ success: false, message: 'This email already exists' });
    }

    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 3600000; // 1 hour
    escort = { ...escort, password: hashedPassword, isVerified: false, verificationToken, verificationExpires};//default for email verification
    await new Escort(escort).save();
    console.log(escort)
      // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        // user: 'muneneclinton159@gmail.com'
        user: 'shale.online@gmail.com',
        pass: 'imsm xexg jfzr swzk'
        // pass: 'jzok hslc ycch hxnq'
      }
    });

    const expiryDate = new Date(verificationExpires).toLocaleString('en-KE', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Africa/Nairobi'
});

const mailOptions = {
  from: 'shale.online@gmail.com',
  to: escort.email,
  subject: 'Email Verification',
  html: `
    <p>Hi ${escort.name},</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="https://streak-1.onrender.com/verify/${verificationToken}">Verify Email</a>
    <p>This link will expire on <strong>${expiryDate}</strong>.</p>
    <p>If it expires, you can request a new one from the login page.</p>
  `
};

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: 'Check your email for verification link' });  
    } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  const escort = await Escort.findOne({
    verificationToken: token,
    verificationExpires: { $gt: Date.now() }
  });

  if (!escort) {
    return res.status(400).send('Invalid or expired token');
  }

  escort.isVerified = true;
  escort.verificationToken = undefined;
  escort.verificationExpires = undefined;

  await escort.save();

  res.redirect('/login');
});


app.get('/login', (req, res)=> {
    if(req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'login.html'));   
});

app.post('/login', async (req, res) => {
  const { input, password } = req.body;
try {
  const escort = await Escort.findOne({  $or: [
    { email: input.trim().toLowerCase() },
    { name: input.trim().toLowerCase() } // make sure 'username' exists on the Escort model
  ]}).lean();
  if (!escort) return res.status(404).json({ success: false, message: 'Account not found' });
  if (!escort.isVerified) {
  return res.status(403).json({ success: false, message: 'Please verify your email first.' });
}

  const match = await bcrypt.compare(password, escort.password);
  if (!match) return res.status(401).json({ success: false, message: 'Invalid password' });

  req.session.escort = {
    name: escort.name,
    id: escort._id,
    email: escort.email,
    role: escort.role || 'user'
  };
  req.session.isLoggedIn = true;

  req.session.save(err => {
    if (err) {
      console.error('Session error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true, message: 'Login successful' });
  });
} catch (err) {
  console.error('Login error:', err);
  res.status(500).json({ success: false, message: 'Server error' });
}

});


app.get("/logout", (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/login");

  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/profile");
    }
    res.clearCookie("connect.sid"); 
    res.redirect("/login");
  });
});

app.post('/post/:id', async (req, res) => {
  const escortId = req.params.id;
  const { allowedtopost } = req.body;

  try {
    const updatedEscort = await Escort.findByIdAndUpdate(escortId, {
      allowedtopost,
      publishedAt: allowedtopost ? new Date() : null
    }).lean();

    if (!updatedEscort) {
      return res.status(404).json({ success: false, message: 'Escort not found' });
    }
    req.session.escort = updatedEscort;
    console.log(req.session.escort.allowedtopost, 'allowed to post')


    return res.json({ success: true, message: `Escort ${allowedtopost ? 'published' : 'unpublished'} successfully` });



  } catch (err) {
    console.error('Error updating publish status:', err);
    return res.status(500).json({ success: false, message: 'Check your internet and try again.' });
  }
});
app.get('/profile', async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  const email = req.session.escort.email;
  const escort = await Escort.findOne({ email });
  if (!escort) {
    return res.status(404).send('Escort not found');
  }

  const viewerId = req.user ? req.user._id : escort._id; 
  const isSelfViewing = viewerId.toString() === escort._id.toString();

  const viewCount = await ProfileView.countDocuments({ profile: escort._id });

  if (!isSelfViewing) {
    await ProfileView.create({ profile: escort._id, viewer: viewerId });
  }

  escort.totalViews = viewCount;

  const missingFields = getMissingFields(escort);
  console.log(escort);
  res.render('escort', {
    loggedInEscort: escort,
    missingFields: missingFields
  });
});

app.post('/profile/edit', async (req, res) => {
  if (!req.session.isLoggedIn || !req.session.escort?.email) {
    return res.redirect('/login');
  }

  const updatedData = req.body;
  console.log(updatedData);

  try {
    let escort = await Escort.findOne({ email: req.session.escort.email }).lean();

    if (!escort) {
      return res.status(404).json({ error: 'Escort not found' });
    }

    if (Array.isArray(updatedData.gallery)) {
      escort.gallery = escort.gallery || [];
      escort.gallery.push(...updatedData.gallery);
      delete updatedData.gallery;
    }

    escort = {...escort, ...updatedData};

    escort.age = Number(updatedData.age || escort.age);
    escort.weight = Number(updatedData.weight || escort.weight);
    escort.userImg = updatedData.userImg || escort.userImg;

    await Escort.updateOne(
    { email: req.session.escort.email },              
    { $set: escort } 
  );
  

    // 6️⃣ Refresh session data
    req.session.escort = escort;

    // Optional: calculate missing fields
    const missingFields = getMissingFields(escort); // your custom function

    console.log(`Escort profile updated: ${escort}`);
    return res.json({ loggedInEscort: escort, missingFields, success: true });

  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Server error during profile update' });
  }
});

//  GET 
//  Renders homepage with boosted escorts first, then random others.
app.get('/', async (req, res) => {
  let escort;

  try {
    if (req.session.escort) {
      escort = await Escort.findOne({ email: req.session.escort.email });
      if (escort && escort.dob) {
        const birthDate = new Date(escort.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        escort.age = age;
      }
    } else {
      escort = null;
    }

    // Check cache
    let verified = homeCache.get('home_escorts');
    if (!verified) {
      // Fetch verified escorts
      const escorts = await Escort.find({ allowedtopost: true })
        .select('name location userImg phone city gender dob about')
        .lean();

      // Active boosts
      const activeBoosts = await BoostRequest.find({
        status: 'confirmed',
        expiresAt: { $gt: new Date() }
      }).select('escort boostType').lean();

      // Boost map
      const boostMap = activeBoosts.reduce((m, b) => {
        m[b.escort.toString()] = b.boostType;
        return m;
      }, {});

      // Annotate escorts
      verified = escorts
        .filter(e => e.name && e.about && e.userImg && e.location)
        .map(e => {
          let age = null;
          if (e.dob) {
            const birthDate = new Date(e.dob);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
          }
          return {
            ...e,
            age,
            isBoosted: Boolean(boostMap[e._id.toString()]),
            boostType: boostMap[e._id.toString()] || null
          };
        });

      // Prioritize boosted by tier only
      const boosted = verified
        .filter(e => e.isBoosted)
        .sort((a, b) =>
          orderRank[getPureTier(b.boostType)] - orderRank[getPureTier(a.boostType)]
        );

      // Shuffle non-boosted
      const normal = verified.filter(e => !e.isBoosted);
      for (let i = normal.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [normal[i], normal[j]] = [normal[j], normal[i]];
      }

      verified = [...boosted, ...normal];
      homeCache.set('home_escorts', verified);
    }

    // Render homepage
    res.render('index', {
      loggedInEscort: escort || null,
      escorts: verified,
      city: 'Nairobi',
      meta: metData(req)
    });

  } catch (err) {
    console.error('Error in home route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/swipe-feed/:city', async (req, res) => {
  const city = req.params.city || 'Nairobi';
  const gender = req.query.gender || 'Female';
  const seenIds = req.query.seen?.split(',') || [];

  const escorts = await Escort.find({
    allowedtopost: true,
    city: { $regex: new RegExp(`^${city}$`, 'i') },
    gender: { $regex: new RegExp(`^${gender}$`, 'i') },
    _id: { $nin: seenIds }
  }).lean();

  res.render('swipe', {escorts: escorts});
});

function metData(req){
return {
      title: 'Streak.com – Find Your Vibe',
      description: 'Discover local companions for chill days and hype nights.',
      image: 'https://raha.com/default-preview.jpg',
      url: req.protocol + '://' + req.get('host') + req.originalUrl
    }
}

app.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /admin/
Disallow: /profile/
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`);
});
 
app.get('/sitemap.xml', async (req, res) => {
  try {
    const profiles = await Escort.find({}); // Replace with your actual DB call
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Generate homepage entry
    const homepageEntry = `
      <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>`;

    // Generate profile entries
    const profileEntries = profiles.map(author => `
      <url>
        <loc>${baseUrl}/author/${encodeURIComponent(author.name)}</loc>
        <lastmod>${new Date(author.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${homepageEntry.trim()}
      ${profileEntries.trim()}
    </urlset>`;

    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res) => {
  res.status(404).render('404');
})
