require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const IncidentReport = require('./models/IncidentReport');
const HelpRequest = require('./models/HelpRequest');
const Notification = require('./models/Notification');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      IncidentReport.deleteMany(),
      HelpRequest.deleteMany(),
      Notification.deleteMany(),
      Comment.deleteMany(),
    ]);

    console.log('Cleared existing data...');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
      department: 'Administration',
      phone: '9876543210',
    });

    const admin1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'staff@campus.edu',
      password: 'staff123',
      role: 'admin',
      department: 'Safety & Security',
      phone: '9876543211',
    });

    const admin2 = await User.create({
      name: 'Prof. Michael Chen',
      email: 'mchen@campus.edu',
      password: 'staff123',
      role: 'admin',
      department: 'Facilities Management',
      phone: '9876543212',
    });

    const student1 = await User.create({
      name: 'John Doe',
      email: 'student@campus.edu',
      password: 'student123',
      role: 'user',
      department: 'Computer Science',
      phone: '9876543213',
    });

    const student2 = await User.create({
      name: 'Jane Smith',
      email: 'jsmith@campus.edu',
      password: 'student123',
      role: 'user',
      department: 'Electrical Engineering',
      phone: '9876543214',
    });

    console.log('Users created...');

    const incidents = await IncidentReport.insertMany([
      {
        title: 'Fire in Chemistry Lab',
        disasterType: 'Fire',
        description: 'Small fire detected in Chemistry Lab B-204. Smoke visible from corridor.',
        severity: 'Critical',
        location: 'Building B, Floor 2, Lab 204',
        incidentDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'In Progress',
        reportedBy: student1._id,
        assignedTo: admin1._id,
        helpRequested: true,
        adminNotes: 'Fire department notified. Evacuation in progress.',
      },
      {
        title: 'Water Leak in Library',
        disasterType: 'Flood',
        description: 'Ceiling leak causing water damage to books and equipment in the main library.',
        severity: 'Medium',
        location: 'Central Library, Ground Floor',
        incidentDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'Under Review',
        reportedBy: student2._id,
        assignedTo: admin2._id,
        helpRequested: false,
      },
      {
        title: 'Student Fainted in Cafeteria',
        disasterType: 'Medical Emergency',
        description: 'Student collapsed during lunch. Needs immediate medical attention.',
        severity: 'High',
        location: 'Main Cafeteria',
        incidentDateTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'Resolved',
        reportedBy: student1._id,
        assignedTo: admin1._id,
        helpRequested: true,
        adminNotes: 'Ambulance called. Student stabilized and taken to hospital.',
      },
      {
        title: 'Exposed Wiring in Parking Lot',
        disasterType: 'Electrical Hazard',
        description: 'Damaged electrical panel with exposed wires near parking lot entrance.',
        severity: 'High',
        location: 'North Parking Lot, Gate 2',
        incidentDateTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
        status: 'Submitted',
        reportedBy: student2._id,
        helpRequested: false,
      },
      {
        title: 'Minor Tremor Felt in Hostel',
        disasterType: 'Earthquake',
        description: 'Students felt mild tremors. Some cracks observed on hostel walls.',
        severity: 'Low',
        location: 'Girls Hostel Block C',
        incidentDateTime: new Date(Date.now() - 72 * 60 * 60 * 1000),
        status: 'Resolved',
        reportedBy: student1._id,
        helpRequested: false,
        adminNotes: 'Structural inspection completed. No major damage found.',
      },
    ]);

    console.log('Incidents created...');

    await HelpRequest.insertMany([
      {
        incidentReport: incidents[0]._id,
        requestedBy: student1._id,
        urgency: 'Critical',
        message: 'Need immediate evacuation assistance and fire extinguisher.',
        status: 'Dispatched',
        respondedBy: admin1._id,
        responseNotes: 'Evacuation team dispatched. Fire extinguishers on site.',
      },
      {
        incidentReport: incidents[2]._id,
        requestedBy: student1._id,
        urgency: 'High',
        message: 'Need first aid and ambulance immediately.',
        status: 'Completed',
        respondedBy: admin1._id,
        responseNotes: 'First aid administered. Ambulance arrived within 10 minutes.',
      },
    ]);

    console.log('Help requests created...');

    await Notification.insertMany([
      {
        title: 'Campus Emergency Drill',
        message: 'Emergency evacuation drill scheduled for tomorrow at 10 AM. All community members must participate.',
        type: 'emergency',
        priority: 'High',
        sender: admin._id,
        isBroadcast: true,
        recipients: [
          { user: student1._id, isRead: false },
          { user: student2._id, isRead: true, readAt: new Date() },
          { user: admin1._id, isRead: false },
          { user: admin2._id, isRead: false },
        ],
      },
      {
        title: 'Report Status Updated',
        message: 'Your report "Student Fainted in Cafeteria" status changed to "Resolved".',
        type: 'status_update',
        priority: 'Medium',
        sender: admin._id,
        relatedIncident: incidents[2]._id,
        recipients: [{ user: student1._id, isRead: false }],
      },
      {
        title: 'Incident Assigned',
        message: 'You have been assigned to incident: "Fire in Chemistry Lab".',
        type: 'assignment',
        priority: 'Critical',
        sender: admin._id,
        relatedIncident: incidents[0]._id,
        recipients: [{ user: admin1._id, isRead: true, readAt: new Date() }],
      },
    ]);

    console.log('Notifications created...');

    await Comment.insertMany([
      {
        incidentReport: incidents[0]._id,
        author: admin1._id,
        content: 'Fire department has been notified. Please evacuate the building immediately.',
        isInternal: false,
      },
      {
        incidentReport: incidents[0]._id,
        author: admin._id,
        content: 'Internal: Contact fire chief directly at extension 911.',
        isInternal: true,
      },
      {
        incidentReport: incidents[2]._id,
        author: admin1._id,
        content: 'Student has been taken to City Hospital. Family has been notified.',
        isInternal: false,
      },
    ]);

    console.log('Comments created...');
    console.log('\n--- Seed Data Summary ---');
    console.log('Admin:    admin@campus.edu / admin123');
    console.log('Admin:    staff@campus.edu / staff123');
    console.log('User:     student@campus.edu / student123');
    console.log(`Created ${incidents.length} incidents, 2 help requests, 3 notifications, 3 comments`);
    console.log('Seed completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
