module.exports = (sequelize, DataTypes) => {

    const ProductCategory = sequelize.define('ProductCategory',{

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },

        name:{
            type:DataTypes.STRING,
            field:'category_name' //override the column name
        },
        status:{
            type:DataTypes.BOOLEAN
        }
    },{underscored: true}

    // {
    //     tableName: 'product_categories',
    //     indexes: [
    //       {
    //         unique: false,
    //         fields: ['post_id'],
    //       },
    //     ],
    //   }
    // Post.hasMany(PostComments, {
    //     foreignKey: 'postId',
    //     constraints: true,
    //     as: 'comments',
    //   });
    
    //   PostComments.belongsTo(Post, {
    //     foreignKey: 'postId',
    //     constraints: true,
    //     as: 'post',
    //   });


)
    // ProductCategory.sync({ force: true })
    return ProductCategory;
}