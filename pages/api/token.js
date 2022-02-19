import executeQuery from '../../utils/db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { tokenId, name, description, image, categories, otherfiles, availableOn, numberOfParcels } = req.body;
    try {
      const result = await executeQuery({
        query: 'INSERT INTO tbl_tokenmeta (tokenId, name, description, image, categories, otherfiles, availableOn, numberOfParcels) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
        values: [tokenId, name, description, image, categories, JSON.stringify(otherfiles), JSON.stringify(availableOn), numberOfParcels],
      });
      return res.status(201).json({ data: result });
    } catch (err) {
      return res.status(500).json({ error: err.message || err.toString() });
    }
  } else if (req.method === 'GET') {
    const { tokenId } = req.query;

    if (tokenId == null || tokenId === undefined) {
      try {
        const result = await executeQuery({
          query: 'SELECT * FROM tbl_tokenmeta'
        });
        return res.status(200).json({ data: result });
      } catch (err) {
        return res.status(500).json({ error: err.message || err.toString() });
      }

   } else {
    if (parseInt(tokenId) > 0) {
      try {
        const result = await executeQuery({
          query: 'SELECT * FROM tbl_tokenmeta WHERE tokenId=?',
          values: [tokenId]
        });
        return res.status(200).json({ data: result[0] });
      } catch (err) {
        return res.status(500).json({ error: err.message || err.toString() });
      }
    } else {
      return res.status(500).json({ error: 'tokenId is required' });
    }
  }
} else if (req.method === 'PUT') {
    const { tokenId, name, description, image, categories, otherfiles, availableOn, numberOfParcels } = req.body;
    if (parseInt(tokenId) > 0) {
      try {
        const result = await executeQuery({
          query: "UPDATE tbl_tokenmeta SET name=?, description=?, image=?, categories=?, otherfiles=?, availableOn=?, numberOfParcels=? WHERE tokenId=?",
          values: [name, description, image, categories, JSON.stringify(otherfiles), JSON.stringify(availableOn), numberOfParcels, tokenId],
        });
        return res.status(200).json({ data: result });
      } catch (err) {
        return res.status(500).json({ error: err.message || err.toString() });
      }
    } else {
      return res.status(500).json({ error: 'tokenId is required' });
    }
  }
};