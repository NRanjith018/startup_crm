import mongoose from 'mongoose';

/**
 * Lead Schema definition for Startup CRM Lite
 */
const leadSchema = new mongoose.Schema(
  {
    /**
     * Lead contact name.
     * @type {String}
     * @description Min length of 2 and max length of 100 characters.
     */
    name: {
      type: String,
      required: [true, 'Lead contact name is required.'],
      trim: true,
      minlength: [2, 'Lead name must contain at least 2 characters.'],
      maxlength: [100, 'Lead name cannot exceed 100 characters.'],
    },
    /**
     * Lead organization company.
     * @type {String}
     * @description Enforces company organization names.
     */
    company: {
      type: String,
      required: [true, 'Company name is required.'],
      trim: true,
    },
    /**
     * Lead contact email.
     * @type {String}
     * @description Checked via standard regex validation for email completeness and lowercased.
     */
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email must be a valid email address.'
      }
    },
    /**
     * Lead telephone number.
     * @type {String}
     * @description Optional details context.
     */
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    /**
     * Status of the lead in sales pipeline stages.
     * @type {String}
     * @description Enum values matching frontend dropdown lists: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost.
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: 'Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, or Lost.'
      },
      default: 'New',
    },
    /**
     * Acquisition channel source of the lead.
     * @type {String}
     * @description Enum values matching frontend lists: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other.
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: 'Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, or Other.'
      },
      default: 'Website',
    },
    /**
     * Optional description notes.
     * @type {String}
     * @description Text length restricted to 1000 characters.
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes description cannot exceed 1000 characters.'],
      default: '',
    },
    /**
     * Lead owner account association reference ID.
     * @type {mongoose.Schema.Types.ObjectId}
     * @description Links lead record documents back to the User model.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner account association is required.'],
    }
  },
  {
    timestamps: true,
    // Instruct Mongoose to include virtuals when mapping documents to JSON/Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes configurations
// 1. Compound index on (owner, status) for fast filtered lookups
leadSchema.index({ owner: 1, status: 1 });

// 2. Compound index on (owner, createdAt) for sorting and monthly stats ranges
leadSchema.index({ owner: 1, createdAt: -1 });

// 3. Single index on email for quick query lookups
leadSchema.index({ email: 1 });

// 4. Index on owner, source for category breakdown aggregations
leadSchema.index({ owner: 1, source: 1 });

// 5. Indexes on search query fields to speed up autocomplete filters
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });
leadSchema.index({ owner: 1, email: 1 });

/**
 * age Virtual Property
 * Computes the number of days elapsed since the lead was created.
 *
 * @returns {number}
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const timeDifference = Math.abs(new Date() - this.createdAt);
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
});

const Lead = mongoose.model('Lead', leadSchema);
export { leadSchema };
export default Lead;
