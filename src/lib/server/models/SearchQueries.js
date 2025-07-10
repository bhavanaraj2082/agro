import mongoose from 'mongoose';

const searchQueriesSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true, 
  },
  status:{
    type:String,
    default: 'pending',
  }
}, { timestamps: true,
    collection: 'searchqueries' });

const SearchQueries =mongoose.models.SearchQueries || mongoose.model('SearchQueries', searchQueriesSchema);


export default SearchQueries;
