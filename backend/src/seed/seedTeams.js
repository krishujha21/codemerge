// Run once: node src/seed/seedTeams.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Team = require('../models/Team');

const teams = [
  {
    "teamName": "Square Algorithm",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "7086483492",
    "members": [
      { "name": "Shashwata Bhattacharjee", "regNo": "RA2611005010201", "email": "ripple.tester7@gmail.com", "department": "B.Tech in Electrical and Electronics Engineering", "section": "D", "role": "leader" },
      { "name": "Medhansh", "regNo": "RA2611003010197", "email": "Ms5968@srmist.edu.in", "department": "Cse core", "section": "C1", "role": "member" },
      { "name": "Atiff Mirza D Sangma", "regNo": "RA2611003010190", "email": "atiff.mira10@gmail.com", "department": "CSE Core", "section": "C1", "role": "member" },
      { "name": "Chandan Handique", "regNo": "RA2611027010121", "email": "Chandanhandique38@gmail.com", "department": "Cse -big data analytics", "section": "AG1", "role": "member" }
    ]
  },
  {
    "teamName": "Codedex",
    "domain": "AI + IoT",
    "leaderPhone": "7981706044",
    "members": [
      { "name": "Advika Singh", "regNo": "RA2511003012418", "email": "as3185@srmist.edu.in", "department": "C.tech", "section": "S2", "role": "leader" },
      { "name": "Aditi Lama", "regNo": "RA2511026010428", "email": "al4015@srmist.edu.in", "department": "CINTEL", "section": "AG1", "role": "member" },
      { "name": "Aanya Rawat", "regNo": "RA2511003011562", "email": "ar1143@srmist.edu.in", "department": "C.Tech", "section": "F2", "role": "member" },
      { "name": "Sarrvesh C", "regNo": "RA2511003010730", "email": "cs5898@srmist.edu.in", "department": "C.Tech", "section": "L1", "role": "member" }
    ]
  },
  {
    "teamName": "4 Bit",
    "domain": "AI for Sustainability",
    "leaderPhone": "9444896375",
    "members": [
      { "name": "Aakanksha Singh", "regNo": "RA2511056010329", "email": "as5661@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "leader" },
      { "name": "Sonali Panigrahi", "regNo": "RA2511056010333", "email": "sp4550@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" },
      { "name": "Sonali Naik", "regNo": "RA2511003011181", "email": "sn1434@srmist.edu.in", "department": "C.Tech", "section": "S1", "role": "member" },
      { "name": "Manasvi Daga", "regNo": "RA25110656010376", "email": "md7797@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" }
    ]
  },
  {
    "teamName": "Brain bytes",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "6387852915",
    "members": [
      { "name": "Harsh", "regNo": "RA2511003020799", "email": "harshpandey1806@gmail.com", "department": "CSE", "section": "M", "role": "leader" },
      { "name": "Piyush Nandi", "regNo": "RA2511003020798", "email": "nandipiyush07@gmail.com", "department": "CSE", "section": "M", "role": "member" },
      { "name": "Iyyam perumal vrishi", "regNo": "RA2511003020800", "email": "rishiiyyamperumal@gmail.com", "department": "CSE", "section": "M", "role": "member" },
      { "name": "Amarnath Biju", "regNo": "RA2511003020791", "email": "amarnathbiju0380@gmail.com", "department": "CSE", "section": "M", "role": "member" }
    ]
  },
  {
    "teamName": "ctrl Z squad",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9599655063",
    "members": [
      { "name": "Paavni Chawla", "regNo": "RA2511003012081", "email": "paavnichawla2006@gmail.com", "department": "ctech", "section": "M2", "role": "leader" },
      { "name": "Shivam Upadhyay", "regNo": "RA2511003012122", "email": "shivamupadhyay.gamer@gmail.com", "department": "Ctech", "section": "N2", "role": "member" },
      { "name": "Afiya Jamil", "regNo": "RA2511003012084", "email": "afiya.jamil1107@gmail.com", "department": "Ctech", "section": "M2", "role": "member" },
      { "name": "Snehil Kale", "regNo": "RA2511003012083", "email": "snehilkale7@gmail.com", "department": "Ctech", "section": "M2", "role": "member" }
    ]
  },
  {
    "teamName": "ZERO RESPONSE TIME",
    "domain": "AI + IoT",
    "leaderPhone": "+91 90237 45505",
    "members": [
      { "name": "Priyanka k", "regNo": "RA2511003010452", "email": "pk6786@srmist.edu.in", "department": "CTECH", "section": "H1", "role": "leader" },
      { "name": "SHIVANESVAR KM", "regNo": "RA2511003010256", "email": "sk0210@srmist.edu.in", "department": "CTECH", "section": "E1", "role": "member" },
      { "name": "M.S.Adhitya", "regNo": "RA2511003010312", "email": "ma5114@srmist.edu.in", "department": "CTECH", "section": "E1", "role": "member" },
      { "name": "Ajay R", "regNo": "RA2511004010194", "email": "ar4776@srmist.edu.in", "department": "ECE DEPT", "section": "C", "role": "member" }
    ]
  },
  {
    "teamName": "Fantastic four",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9330351110",
    "members": [
      { "name": "Roshan Kumar Jha", "regNo": "RA2611026010177", "email": "rj2128@srmist.edu.in", "department": "CINTEL (Computational Intelligence)", "section": "O-1", "role": "leader" },
      { "name": "Subhang Choubey", "regNo": "RA2611026010627", "email": "sc4485@srmist.edu.in", "department": "CINTEL (Computational Intelligence)", "section": "U-1", "role": "member" },
      { "name": "Hitesh Vuyyuru", "regNo": "RA2611003010201", "email": "hv5258@srmist.edu.in", "department": "CTECH (Computing Technologies)", "section": "C-1", "role": "member" },
      { "name": "Achintya Choubey", "regNo": "RA2611026010243", "email": "ac2157@srmist.edu.in", "department": "CINTEL (Computational Intelligence)", "section": "P-1", "role": "member" }
    ]
  },
  {
    "teamName": "Tech Titans",
    "domain": "AI for Safety & Security",
    "leaderPhone": "7217785543",
    "members": [
      { "name": "Anushka Sharma", "regNo": "RA2511003010788", "email": "as4918@srmist.edu.in", "department": "CSE core", "section": "M1", "role": "leader" },
      { "name": "Baani Arora", "regNo": "RA2511003010458", "email": "ba4657@srmist.edui.in", "department": "CSE core", "section": "H1", "role": "member" },
      { "name": "Nirmaan Singh Baid", "regNo": "RA2511003010471", "email": "nb8304@srmist.edu.in", "department": "CSE core", "section": "H1", "role": "member" },
      { "name": "Naman Dudhodia", "regNo": "RA2511003011186", "email": "nd7193@srmist.edu.in", "department": "CSE", "section": "S1", "role": "member" }
    ]
  },
  {
    "teamName": "Team Ektara",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9965204120",
    "members": [
      { "name": "Veera Raghavan J", "regNo": "RA2511026010333", "email": "veera@veeraraghavanofficial.com", "department": "CINTEL", "section": "AF1", "role": "leader" },
      { "name": "Poobesh S", "regNo": "RA2511026010334", "email": "ps5083@srmist.edu.in", "department": "CINTEL", "section": "AF1", "role": "member" },
      { "name": "Sanjeeshwar S", "regNo": "RA2511026010298", "email": "ss3641@srmist.edu.in", "department": "CINTEL", "section": "AF1", "role": "member" },
      { "name": "Nafees N", "regNo": "RA2511026010306", "email": "nn4296@srmist.edu.in", "department": "CINTEL", "section": "AF1", "role": "member" }
    ]
  },
  {
    "teamName": "Syntax Samurai",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "6380044278",
    "members": [
      { "name": "Hari Charan B", "regNo": "RA2411056010101", "email": "hb8029@srmist.edu.in", "department": "DSBS", "section": "AP1", "role": "leader" },
      { "name": "Koushik Rajan N", "regNo": "RA2411056010118", "email": "kn8584@srmist.edu.in", "department": "DSBS", "section": "AP1", "role": "member" },
      { "name": "Parnit singh", "regNo": "RA2411056010076", "email": "ps7757@srmist.edu.in", "department": "DSBS", "section": "AP1", "role": "member" },
      { "name": "Dinesh Raja M", "regNo": "RA2411056010131", "email": "dm5325@srmist.edu.in", "department": "DSBS", "section": "AQ1", "role": "member" }
    ]
  },
  {
    "teamName": "ANTIMATTER",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9517375013",
    "members": [
      { "name": "DEVANSH PATHAK", "regNo": "RA2511033010137", "email": "dp6392@srmist.edu.in", "department": "CINTEL", "section": "AN2", "role": "leader" },
      { "name": "Swetank kumar", "regNo": "RA2511033010134", "email": "sk2737@srmist.edu.in", "department": "CINTEL", "section": "AN2", "role": "member" },
      { "name": "Sahim Rizvi", "regNo": "RA2511013010074", "email": "sr7695@srmist.edu.in", "department": "Biomedical Engineering", "section": "Sec-B", "role": "member" },
      { "name": "Sreeelakshmi P.", "regNo": "RA2511013010079", "email": "sp1031@srmist.edu.in", "department": "Biomedical Engineering", "section": "Sec - B", "role": "member" }
    ]
  },
  {
    "teamName": "CodingOG's",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "7257896988",
    "members": [
      { "name": "Darshil singh", "regNo": "RA2511033010011", "email": "darshil16283@gmail.com", "department": "Cintel", "section": "Al2", "role": "leader" },
      { "name": "Md Aftabuddin", "regNo": "RA2511033010025", "email": "mdaftabsk123456@gmail.com", "department": "Cintel", "section": "AL2", "role": "member" },
      { "name": "Kabir khan", "regNo": "RA2511033010001", "email": "Kk2487@srmist.edu.in", "department": "Cintel", "section": "Al2", "role": "member" },
      { "name": "Divjot singh uppal", "regNo": "RA2511033010063", "email": "ds0725@srmist.edu.in", "department": "Cintel", "section": "Al2", "role": "member" }
    ]
  },
  {
    "teamName": "Krypta-X",
    "domain": "AI for Safety & Security",
    "leaderPhone": "9976531001",
    "members": [
      { "name": "Kawin", "regNo": "RA2411047010140", "email": "kawinprakash007@gmail.com", "department": "CINTEL", "section": "C", "role": "leader" },
      { "name": "Priya Shakthi", "regNo": "RA2411047010144", "email": "priyashakthi19102006@gmail.com", "department": "CINTEL", "section": "C", "role": "member" },
      { "name": "Nithish kumar R", "regNo": "RA2411047010154", "email": "nr6618@srmist.edu.in", "department": "CINTEL", "section": "C", "role": "member" }
    ]
  },
  {
    "teamName": "BlankSpace",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9492328278",
    "members": [
      { "name": "Bhaskara Sai Krishna Vamshitha", "regNo": "RA2411026011317", "email": "sb2410@srmist.edu.in", "department": "CINTEL", "section": "AJ2", "role": "leader" },
      { "name": "Adhintra Anumanathan", "regNo": "RA2411027010154", "email": "aa1429@srmist.edu.in", "department": "DSBS", "section": "AS1", "role": "member" },
      { "name": "Garlapati Hansini Reddy", "regNo": "RA2411026011324", "email": "hg2100@srmist.edu.in", "department": "CINTEL", "section": "AJ2", "role": "member" },
      { "name": "Gopikadevi Ramalingam", "regNo": "RA2411026011369", "email": "gr3555@srmist.edu.in", "department": "CINTEL", "section": "AJ2", "role": "member" }
    ]
  },
  {
    "teamName": "Error 404",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "7683078980",
    "members": [
      { "name": "Kabir Singh Chadha", "regNo": "RA2511026010027", "email": "kc6135@srmist.edu.in", "department": "Cintel", "section": "AA1", "role": "leader" },
      { "name": "Sanjay M", "regNo": "RA2511026010025", "email": "sm0660@srmist.edu.in", "department": "Cintel", "section": "AA1", "role": "member" },
      { "name": "Asmit Mukherjee", "regNo": "RA2511026010019", "email": "am9145@srmist.edu.in", "department": "Cintel", "section": "AA1", "role": "member" },
      { "name": "Sarvagya Gupta", "regNo": "RA2511026010004", "email": "sg2709@srmist.edu.in", "department": "Cintel", "section": "AA1", "role": "member" }
    ]
  },
  {
    "teamName": "Innovexa",
    "domain": "AI for Sustainability",
    "leaderPhone": "9945274620",
    "members": [
      { "name": "Advaitha lakshmi E", "regNo": "RA2411026010287", "email": "al4194@srmist.edu.in", "department": "Cintel", "section": "AF1", "role": "leader" },
      { "name": "Sasha Santhosh", "regNo": "RA2411026010249", "email": "ss6515@srmist.edu.in", "department": "Cintel", "section": "AE1", "role": "member" },
      { "name": "Sashank peddada", "regNo": "RA2411042010066", "email": "sp3455@srmist.edu.in", "department": "DSBS", "section": "AT2", "role": "member" }
    ]
  },
  {
    "teamName": "Nova",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "918292030",
    "members": [
      { "name": "K. Akshay Manikanta", "regNo": "RA2411056010210", "email": "ak1547@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "leader" },
      { "name": "G vishnu vardhan", "regNo": "RA2411056010184", "email": "gg7787@srmist.edu.in", "department": "DSBS", "section": "AQ1", "role": "member" },
      { "name": "K Jagan", "regNo": "RA2411056010185", "email": "jk2812@srmist.edu.in", "department": "DSBS", "section": "AQ1", "role": "member" },
      { "name": "M Karthikeya", "regNo": "RA2411056010165", "email": "km8956@srmist.edu.in", "department": "DSBS", "section": "AQ1", "role": "member" }
    ]
  },
  {
    "teamName": "CODE RED",
    "domain": "AI for Sustainability",
    "leaderPhone": "9008313867",
    "members": [
      { "name": "Vismitha Kothapalli", "regNo": "RA2511056010225", "email": "vk4249@srmist.edu.in", "department": "DSBS", "section": "AS1", "role": "leader" },
      { "name": "Pritha Dey", "regNo": "RA2511056010209", "email": "deypritha727@gmail.com", "department": "DSBS", "section": "AS1", "role": "member" },
      { "name": "Shreeya Sakhuja", "regNo": "RA2511026011174", "email": "shreeyaasakhuja@gmail.com", "department": "CINTEL", "section": "AD2", "role": "member" },
      { "name": "Rohan", "regNo": "RA2411003010917", "email": "ra3682@srmist.edu.in", "department": "CTECH", "section": "O1", "role": "member" }
    ]
  },
  {
    "teamName": "Coder Dumplings",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "7979816459",
    "members": [
      { "name": "Rachit Kumar", "regNo": "RA2611029010020", "email": "rk6744@srmist.edu.in", "department": "BTech-CSE-Computer Networking", "section": "AI2", "role": "leader" },
      { "name": "Aman Singh", "regNo": "RA2611003011770", "email": "ks4207@srmist.edu.in", "department": "Btech - CSE Core", "section": "AI2", "role": "member" },
      { "name": "Ratnesh Zade", "regNo": "RA2611029010021", "email": "rs0213@srmist.edu.in", "department": "Btech - CSE DevOps", "section": "AI2", "role": "member" },
      { "name": "Vardan Gupta", "regNo": "RA2611003011757", "email": "vg7307@srmist.edu.in", "department": "BTech - CSE - Core", "section": "AI2", "role": "member" }
    ]
  },
  {
    "teamName": "Bytestorm",
    "domain": "AI for Sustainability",
    "leaderPhone": "8148220772",
    "members": [
      { "name": "Subharna Suruthi", "regNo": "RA2611703010014", "email": "sk7594@srmist.edu.in", "department": "Networking and Communication", "section": "AD2", "role": "leader" },
      { "name": "Madhurja Ghoshal", "regNo": "RA2611030010558", "email": "mg5362@srmist.edu.in", "department": "NWC", "section": "AD2", "role": "member" },
      { "name": "Aishitha Shree", "regNo": "RA2611030010546", "email": "as5045@srmist.edu.in", "department": "NWC", "section": "AD2", "role": "member" },
      { "name": "Vaishnavi Agarwal", "regNo": "RA2611030010567", "email": "va3246@srmist.edu.in", "department": "NWC", "section": "AD2", "role": "member" }
    ]
  },
  {
    "teamName": "Los Blancos",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "8104056278",
    "members": [
      { "name": "Aryan Pawar", "regNo": "RA2511056010342", "email": "as3354@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "leader" },
      { "name": "Himanshu Agarwal", "regNo": "RA2511056010351", "email": "ha8956@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" },
      { "name": "Foram Patel", "regNo": "RA2511056010343", "email": "ff1487@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" },
      { "name": "Abhyudai Bajpai", "regNo": "RA2511056010345", "email": "ab5723@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" }
    ]
  },
  {
    "teamName": "COSMOS",
    "domain": "AI for Safety & Security",
    "leaderPhone": "9632147666",
    "members": [
      { "name": "Mahadevan Kallat", "regNo": "RA2511056010349", "email": "mk5625@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "leader" },
      { "name": "Charan Suresh", "regNo": "RA2511056010344", "email": "cs4466@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" },
      { "name": "Shakthivel", "regNo": "RA2511056010378", "email": "hs1626@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" },
      { "name": "Nadha Fathima", "regNo": "RA2511056010380", "email": "nf7202@srmist.edu.in", "department": "DSBS", "section": "AO2", "role": "member" }
    ]
  },
  {
    "teamName": "TechTubbies",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9318458235",
    "members": [
      { "name": "Raghav Sharma", "regNo": "RA2611026011018", "email": "raghavsh498@gmail.com", "department": "CSE AI ML", "section": "M-2", "role": "leader" },
      { "name": "ABHINEET JHA", "regNo": "RA2611026010876", "email": "abhineet2409jha@gmail.com", "department": "CSE+AI/ML", "section": "X1", "role": "member" },
      { "name": "Tanishq Gupta", "regNo": "RA2611026010880", "email": "tanishqvro@gmail.com", "department": "CSE w/s AI/ML", "section": "X1", "role": "member" },
      { "name": "SAIRAV KHARGA", "regNo": "RA2611043010012", "email": "sairavkharga003@gmail.com", "department": "ELECTRONICS AND COMPUTER ENGINEERING", "section": "P1", "role": "member" }
    ]
  },
  {
    "teamName": "Alpha Coders",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9600209586",
    "members": [
      { "name": "Janaani S V", "regNo": "RA2612052010017", "email": "js9539@srmist.edu.in", "department": "M. Tech / Data Science", "section": "A", "role": "leader" },
      { "name": "Zacharia Jebaraj F", "regNo": "RA2612052010026", "email": "zj5445@srmist.edu.in", "department": "M. Tech / Data Science", "section": "A", "role": "member" },
      { "name": "Kishore R", "regNo": "RA2612052010035", "email": "kr2930@srmist.edu.in", "department": "M. Tech / Data Science", "section": "A", "role": "member" },
      { "name": "Sai Pranavi N", "regNo": "RA2612052010012", "email": "sn6408@srmist.edu.in", "department": "M. Tech / Data Science", "section": "A", "role": "member" }
    ]
  },
  {
    "teamName": "Vibe",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9376102391",
    "members": [
      { "name": "Dharaksh Kataria", "regNo": "RA2511033010004", "email": "dharaksh2807@gmail.com", "department": "CSE SWE", "section": "AL2", "role": "leader" },
      { "name": "Vedansh Mishra", "regNo": "RA2511033010055", "email": "vedanshmishra467@gmail.com", "department": "CSE SWE", "section": "AL2", "role": "member" },
      { "name": "Nirbhay kaushik", "regNo": "Ra2511033010054", "email": "nirbhaykaushik09@gmail.com", "department": "CSE SWE", "section": "AL2", "role": "member" }
    ]
  },
  {
    "teamName": "AMPV Team",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "+91 73582 48071",
    "members": [
      { "name": "Arjun Raj M", "regNo": "RA2512052010015", "email": "am6695@srmist.edu.in", "department": "Data Science", "section": "A", "role": "leader" },
      { "name": "Praveen", "regNo": "RA2512052010033", "email": "pa8178@srmist.edu.in", "department": "Data Science", "section": "A", "role": "member" },
      { "name": "S Mukuntha Narasimhan", "regNo": "RA2512052010025", "email": "mn5253@srmist.edu.in", "department": "Data science", "section": "A", "role": "member" },
      { "name": "Vikas V", "regNo": "RA2512052010027", "email": "vv4302@srmist.edu.in", "department": "Data science", "section": "A", "role": "member" }
    ]
  },
  {
    "teamName": "Rookie Coders",
    "domain": "AI for Sustainability",
    "leaderPhone": "9629442062",
    "members": [
      { "name": "NIKHIL KARTHIKEYAN B", "regNo": "RA2611026011214", "email": "nikhilbalasundaram111@gmail.com", "department": "B.TECH CSE AI ML", "section": "P2", "role": "leader" },
      { "name": "PRAHALATHAN S", "regNo": "RA2611026010504", "email": "prahalathans95@gmail.com", "department": "B.TECH CSE AIML", "section": "S1", "role": "member" },
      { "name": "K S HARSITHU", "regNo": "RA2611003010365", "email": "knsakthi26@gmail.com", "department": "BTech CSE CORE", "section": "E1", "role": "member" },
      { "name": "VIRUTHEESH S", "regNo": "RA2611026011223", "email": "virutheesh2008@gmail.com", "department": "B TECH CSE AI ML", "section": "P2", "role": "member" }
    ]
  },
  {
    "teamName": "Mavericks",
    "domain": "AI for HealthTech/Fintech/EdTech",
    "leaderPhone": "9675852627",
    "members": [
      { "name": "Anmol", "regNo": "RA2511056010168", "email": "anmol261027@gmail.com", "department": "DSBS", "section": "AR1", "role": "leader" },
      { "name": "Ishaan Tiwari", "regNo": "RA2511056010201", "email": "it9947@srmist.edu.in", "department": "DSBS", "section": "AS1", "role": "member" },
      { "name": "Neeti Soni", "regNo": "RA2511056010199", "email": "ns3380@srmist.edu.in", "department": "DSBS", "section": "AS1", "role": "member" },
      { "name": "Salman Faris", "regNo": "RA2511056010215", "email": "sf8990@srmist.edu.in", "department": "DSBS", "section": "AS1", "role": "member" }
    ]
  },
  {
    "teamName": "CODE BUSTER'S",
    "domain": "AI + IoT",
    "leaderPhone": "9580578477",
    "members": [
      { "name": "Vishesta", "regNo": "RA2611003010559", "email": "vz9634@srmist.edu.in", "department": "CSE", "section": "H1", "role": "leader" },
      { "name": "Madhura Donode", "regNo": "RA2611026010141", "email": "Madhuradonode@gmail.com", "department": "Cse", "section": "N1", "role": "member" },
      { "name": "Aditi Shah", "regNo": "RA2611003010311", "email": "Shah.aditi1109@gmail.com", "department": "Cse", "section": "E1", "role": "member" }
    ]
  },
  {
    "teamName": "Hawk Coders",
    "domain": "AI + IoT",
    "leaderPhone": "+91 80764 67948",
    "members": [
      { "name": "Sarthak Anand Singh", "regNo": "RA2411042010020", "email": "sa7674@srmist.edu.in", "department": "DSBS", "section": "AS2", "role": "leader" },
      { "name": "Aditya Sathik Halder", "regNo": "RA2411042010054", "email": "ah8602@srmist.edu.in", "department": "DSBS", "section": "AT2", "role": "member" },
      { "name": "Siddh Sengupta", "regNo": "RA2411003010107", "email": "ss1520@srmist.edu.in", "department": "CSE Core", "section": "B1", "role": "member" },
      { "name": "Abhishek Jaiswal", "regNo": "RA2411003010764", "email": "aj4018@srmist.edu.in", "department": "CSE Core", "section": "L1", "role": "member" }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Team.deleteMany({});
    console.log('Cleared existing teams');

    const inserted = await Team.insertMany(teams);
    console.log(`Seeded ${inserted.length} teams successfully`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
