const { sequelize } = require("../db/connection");
const { DataTypes } = require("sequelize");

// User Model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("job_seeker", "employer"),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

// Job Model
const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: DataTypes.STRING,
    employmentType: {
      type: DataTypes.ENUM("full-time", "part-time", "contract", "internship"),
      defaultValue: "full-time",
    },
    skills: {
      type: DataTypes.TEXT, // We'll store as JSON string for simplicity
      defaultValue: "[]",
    },
    employerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "closed", "draft"),
      defaultValue: "active",
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

// Application Model
const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "jobs",
        key: "id",
      },
    },
    applicantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    coverLetter: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewed", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "applications",
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Job, { foreignKey: "employerId", as: "jobs" });
Job.belongsTo(User, { foreignKey: "employerId", as: "employer" });

User.hasMany(Application, { foreignKey: "applicantId", as: "applications" });
Application.belongsTo(User, { foreignKey: "applicantId", as: "applicant" });

Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

module.exports = {
  User,
  Job,
  Application,
  syncDatabase: async () => {
    try {
      await sequelize.sync({ force: false }); // Set force: true only in development to drop tables
      console.log("✅ Database synced successfully");
    } catch (error) {
      console.error("❌ Database sync failed:", error);
    }
  },
};
