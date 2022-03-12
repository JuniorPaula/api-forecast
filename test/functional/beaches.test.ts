describe('Beaches functional tests', () => {
  describe('When create a beach', () => {
    it('Should create a beach with success', async () => {
      const newBeache = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/beaches')
        .send(newBeache);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeache));
    });
  });
});
