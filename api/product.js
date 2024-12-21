export const getProducts = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                    {
                        id:1,
                        name: "Product 1",
                        price: 1100,
                    },
                    {
                        id:2,
                        name: "Product 2",
                        price: 1200,
                    } 
                ])
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
