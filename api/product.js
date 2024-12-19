export const getProducts = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                products: [
                    {
                        id:1,
                        name: "Product 1",
                        price: 100,
                    }
                ]
            })
        }, 4000);
    });
}

export const getProductDetails = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                product: [
                    {
                        id: id,
                        name: `Product ${id}`,
                        price: 100 * id + 2,
                    }
                ]
            })
        }, 4000);
    });
}
