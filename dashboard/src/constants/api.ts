const api = {
  /**
   * Get all collections in the database
   * @method GET
   */
  getAllCollection: '/collections/all',

  /**
   * @method GET
   * @param collectionName
   */
  handleCollectionsTree: '/collections/tree/',

  /**
   * @method GET
   * @param collectionName
   */
  handleCollectionsSchema: '/collections/schema/',

  /**
   * @method GET
   * @param id
   */
  handleObjSubObj: '/object/subobjects/',

  /**
   * @method GET,PUT
   * @param id
   */
  handleObjectAttributes: '/object/attributes/',

  /**
   * @method POST,DELETE
   * @param coll_name
   * @param id
   */
  handleObject: '/object/',

  /**
   * @method POST
   */
  handleAddObject: '/object/new/',
}

export default api
