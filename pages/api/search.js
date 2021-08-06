import { createClient } from '@supabase/supabase-js';
import { projectUrl } from '../../constants';

const supabase = createClient(projectUrl, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export async function search(fromQuery, toQuery) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .ilike('from_city', `%${fromQuery}%`)
      .ilike('to_city', `%${toQuery}%`);
    return { data, error };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const from = req.query.from || '';
    console.log(from);
    const output = await search(from, req.query.to || '');
    console.log(output);
    res.status(200).json(output);
  }
}
