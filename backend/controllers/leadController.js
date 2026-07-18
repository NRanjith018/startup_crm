import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * getLeads
 * Retrieves a filtered, sorted, and paginated list of leads belonging to the authenticated user.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<Object>} Paginated response JSON structure
 */
export const getLeads = async (req, res, next) => {
  const { 
    status, 
    search, 
    source,
    page = 1, 
    limit = 20, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    dateFrom,
    dateTo
  } = req.query;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getLeads] Querying leads for user: ${req.user._id}`);
    }

    // Isolate queries to the logged-in user
    const filter = { owner: req.user._id };

    // Status filter (ignore 'All' or 'all')
    if (status && status !== 'All' && status !== 'all') {
      filter.status = status;
    }

    // Source filter (ignore 'All' or 'all')
    if (source && source !== 'All' && source !== 'all') {
      filter.source = source;
    }

    // Date range filters
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endOfDay;
      }
    }

    // Search query with regex checking name, company, or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const currentPage = Math.max(1, parseInt(page));
    const itemsLimit = Math.max(1, parseInt(limit));
    const skipCount = (currentPage - 1) * itemsLimit;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    // Execute list query and count parallelly
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skipCount)
        .limit(itemsLimit),
      Lead.countDocuments(filter)
    ]);

    return paginatedResponse(res, leads, total, currentPage, itemsLimit);
  } catch (err) {
    next(err);
  }
};

/**
 * createLead
 * Registers a new lead document.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:createLead] Creating lead for user: ${req.user._id}`);
    }

    const leadData = {
      ...req.body,
      owner: req.user._id
    };

    const lead = await Lead.create(leadData);

    return successResponse(res, lead, 'Lead created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * getLeadById
 * Retrieves detailed parameters of a single lead by its ID.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getLeadById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getLeadById] Fetching lead ${id} for user: ${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead fetched successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * updateLead
 * Modifies an existing lead record.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateLead = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:updateLead] Updating lead ${id} for user: ${req.user._id}`);
    }

    const updateFields = { ...req.body };
    delete updateFields.owner;

    const lead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * updateLeadStatus
 * Modifies only the status parameter of a lead.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateLeadStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:updateLeadStatus] Patching status for lead ${id} to ${status}`);
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead status updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * deleteLead
 * Removes a lead record permanently.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteLead = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:deleteLead] Deleting lead ${id} for user: ${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();

    return successResponse(res, null, 'Lead deleted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * getLeadStats
 * Aggregates dashboard analytics using a single Mongo aggregation pipeline with facets.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<Object>} Statistics payload
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getLeadStats] Running MongoDB stats aggregation for user: ${req.user._id}`);
    }

    // Set calendar month boundary variables
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // MongoDB Single aggregate pipeline utilizing $facet
    const statsResult = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $facet: {
          totalLeads: [
            { $count: 'count' }
          ],
          statusBreakdown: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          sourceBreakdown: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          thisMonthLeads: [
            { $match: { createdAt: { $gte: startOfThisMonth } } },
            { $count: 'count' }
          ],
          lastMonthLeads: [
            { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = statsResult[0] || {};
    const totalLeads = result.totalLeads?.[0]?.count || 0;
    const thisMonthLeads = result.thisMonthLeads?.[0]?.count || 0;
    const lastMonthLeads = result.lastMonthLeads?.[0]?.count || 0;

    // Format status breakdown
    const statusMap = {
      New: 0,
      Contacted: 0,
      'Meeting Scheduled': 0,
      'Proposal Sent': 0,
      Won: 0,
      Lost: 0
    };
    if (result.statusBreakdown) {
      result.statusBreakdown.forEach((item) => {
        if (item._id in statusMap) {
          statusMap[item._id] = item.count;
        }
      });
    }

    // Format source breakdown
    const sourceMap = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      'Cold Call': 0,
      'Email Campaign': 0,
      Other: 0
    };
    if (result.sourceBreakdown) {
      result.sourceBreakdown.forEach((item) => {
        if (item._id in sourceMap) {
          sourceMap[item._id] = item.count;
        }
      });
    }

    // Conversion rate: (Won / Total) * 100 (handles edge case division by zero)
    const wonCount = statusMap['Won'];
    const conversionRate = totalLeads > 0 
      ? parseFloat(((wonCount / totalLeads) * 100).toFixed(1))
      : 0.0;

    // Monthly leads growth rate: ((ThisMonth - LastMonth) / LastMonth) * 100
    let growthRate = 0.0;
    if (lastMonthLeads > 0) {
      growthRate = parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1));
    } else if (thisMonthLeads > 0) {
      growthRate = 100.0; // Assume 100% growth if starting from zero leads last month
    }

    const payload = {
      totalLeads,
      statusBreakdown: statusMap,
      conversionRate,
      sourceBreakdown: sourceMap,
      thisMonthLeads,
      lastMonthLeads,
      growthRate
    };

    return successResponse(res, payload, 'Lead statistics calculated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * getMonthlyStats
 * Retrieves monthly totals, won/lost ratios, and conversion rates over the last 6 months.
 * Pre-fills months with zero entries to prevent chart gaps.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<Object>} 6-month statistical logs
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getMonthlyStats] Generating 6-month metrics for user: ${req.user._id}`);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = [];

    // Pre-populate slots chronologically (oldest to newest)
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - i);
      const year = targetDate.getFullYear();
      const monthNum = targetDate.getMonth() + 1; // 1-indexed month number
      const label = `${monthNames[targetDate.getMonth()]} ${year}`;

      monthlyStats.push({
        month: label,
        year,
        monthNum,
        total: 0,
        won: 0,
        lost: 0,
        conversionRate: 0.0
      });
    }

    // Set lower bounding date
    const rangeStart = new Date();
    rangeStart.setMonth(rangeStart.getMonth() - 5);
    rangeStart.setDate(1);
    rangeStart.setHours(0, 0, 0, 0);

    const aggregates = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: rangeStart }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] }
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] }
          }
        }
      }
    ]);

    // Merge database aggregation results with pre-populated month slots
    aggregates.forEach((dbItem) => {
      const matchSlot = monthlyStats.find(
        (slot) => slot.year === dbItem._id.year && slot.monthNum === dbItem._id.month
      );
      if (matchSlot) {
        matchSlot.total = dbItem.total;
        matchSlot.won = dbItem.won;
        matchSlot.lost = dbItem.lost;
        matchSlot.conversionRate = dbItem.total > 0
          ? parseFloat(((dbItem.won / dbItem.total) * 100).toFixed(1))
          : 0.0;
      }
    });

    // Clean payload variables (strip helper fields)
    const finalPayload = monthlyStats.map(({ month, total, won, lost, conversionRate }) => ({
      month,
      total,
      won,
      lost,
      conversionRate
    }));

    return successResponse(res, finalPayload, 'Monthly statistics retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * searchLeadsQuick
 * Quick search endpoint optimized for client autocompletion inputs.
 * Returns only _id, name, company, email, and status.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const searchLeadsQuick = async (req, res, next) => {
  const { q, limit = 5 } = req.query;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:searchLeadsQuick] Quick search keyword: ${q} (limit: ${limit})`);
    }

    if (!q) {
      return successResponse(res, [], 'Empty query.');
    }

    const filter = {
      owner: req.user._id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    };

    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(Math.min(50, parseInt(limit)));

    return successResponse(res, leads, 'Quick search completed.');
  } catch (err) {
    next(err);
  }
};
