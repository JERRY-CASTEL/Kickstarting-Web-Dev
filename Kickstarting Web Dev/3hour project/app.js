document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('billForm');
    fetchAllBills();

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const price = document.getElementById('price').value;
        const dish = document.getElementById('dish').value;
        const table = document.getElementById('table').value;

        const billData = {
            price,
            dish,
            table
        };

        try {
          
            const response = await fetch('https://crudcrud.com/api/7ebd65f54f0540429e976093f2666d6d/bills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(billData)
            });

            if (!response.ok) {
                throw new Error('Failed to add bill.');
            }

            const savedBill = await response.json();

            appendBillToTable(savedBill);

            form.reset();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function fetchAllBills() {
        try {
            const response = await fetch('https://crudcrud.com/api/7ebd65f54f0540429e976093f2666d6d/bills');
            if (!response.ok) {
                throw new Error('Failed to fetch bills.');
            }

            const bills = await response.json();
            
            bills.forEach(bill => {
                appendBillToTable(bill);
            });

        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    }

    function appendBillToTable(bill) {
        const listItem = document.createElement('li');
        listItem.textContent = `${bill.dish} - $${bill.price} `;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteBill(bill._id, listItem));

        listItem.appendChild(deleteButton);

        const tableClass = bill.table === "table1" ? "table_1_list" :
                           bill.table === "table2" ? "table_2_list" :
                           "table_3_list";  

        const tableList = document.querySelector(`.${tableClass}`);
        if (tableList) {
            tableList.appendChild(listItem);
        } else {
            console.error(`Table list not found for ${tableClass}`);
        }
    }

    async function deleteBill(billId, listItem) {
        try {
            const response = await fetch(`https://crudcrud.com/api/7ebd65f54f0540429e976093f2666d6d/bills/${billId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete bill.');
            }
            listItem.remove();
        } catch (error) {
            console.error('Error deleting bill:', error);
        }
    }
});
