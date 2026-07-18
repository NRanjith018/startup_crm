import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema definition for Startup CRM Lite
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * User's full name.
     * @type {String}
     * @description Enforces a min length of 2 and max length of 50 characters.
     */
    name: {
      type: String,
      required: [true, 'User name is required.'],
      trim: true,
      minlength: [2, 'User name must contain at least 2 characters.'],
      maxlength: [50, 'User name cannot exceed 50 characters.'],
    },
    /**
     * User's unique login email.
     * @type {String}
     * @description Checked via standard regex validation for email completeness and lowercased.
     */
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email must be a valid email address.'
      }
    },
    /**
     * User's encrypted login credentials.
     * @type {String}
     * @description Password must be at least 6 characters in length and is hashed prior to database commits.
     */
    password: {
      type: String,
      required: [true, 'Password credentials are required.'],
      minlength: [6, 'Password must contain at least 6 characters.'],
    },
    /**
     * System user access privileges.
     * @type {String}
     * @description Can be either admin or user, defaults to user role.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user.'
      },
      default: 'user',
    },
    /**
     * Active state controls of user accounts.
     * @type {Boolean}
     * @description Allows administrators to toggle user access block toggles.
     */
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to the database
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password inputs during login sessions
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Override toJSON instance method to strip hashed passwords before serialization
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export { userSchema };
export default User;
