// Storage Controller
const StorageCtrl = (function() {
    // Public methods
    return {
        storeItem: (item) => {
            let items = [];

            // Check if any items in ls
            if (localStorage.getItem('items') !== null) {
                // Get what's already in ls
                items = JSON.parse(localStorage.getItem('items'));
            }

            // Push new item
            items.push(item);

            // Set ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        removeItem: (deletedItem) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (deletedItem.id === item.id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItems: () => {
            localStorage.removeItem('items');
        },
        getItems: () => {
            let items = [];
            if (localStorage.getItem('items') !== null) {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        }
    }
})();

// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItems(),
        currentItem: null,
        totalCalories: 0
    };

    return {
        logData: function() {
            return data;
        },
        getItems: function() {
            return data.items;
        },
        getItemById: function(id) {
            let found = null;

            // Loop through items
            data.items.forEach(function(item) {
                if (item.id === id) {
                    found = item
                }
            });

            return found;
        },
        addItem: function(name, calories) {
            let ID;

            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length -1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            const newItem = new Item(ID, name, calories);
            
            // Add to items array
            data.items.push(newItem);
            
            return newItem;
        },
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id) {
            // Get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;

            // Loop through items and add cals
            data.items.forEach(function(item) {
                total += item.calories;
            });

            // Set total cal in data structure
            data.totalCalories = total;

            return data.totalCalories;
        }
    }
})();

// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    let state = '';

    // Public methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `<li id="item-${item.id}" class="collection-item">
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa-solid fa-pencil"></i>
                    </a>
                </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            const itemList = document.querySelector(UISelectors.itemList);

            // Show the list if hidden
            if (itemList.style.display !== 'block') {
                itemList.style.display = 'block';
            }

            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa-solid fa-pencil"></i>
            </a>`;
            // Insert item
            itemList.insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa-solid fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(item => item.remove());
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            UICtrl.hideBtn(
                document.querySelector(UISelectors.updateBtn),
                document.querySelector(UISelectors.deleteBtn),
                document.querySelector(UISelectors.backBtn)
            );
            UICtrl.showBtn(document.querySelector(UISelectors.addBtn));
            state = 'add';
        },
        showEditState: function() {
            UICtrl.showBtn(
                document.querySelector(UISelectors.updateBtn),
                document.querySelector(UISelectors.deleteBtn),
                document.querySelector(UISelectors.backBtn)
            );
            UICtrl.hideBtn(document.querySelector(UISelectors.addBtn));
            state = 'edit';
        },
        hideBtn: function(...btns) {
            btns.forEach(btn => btn.style.display = 'none');
        },
        showBtn: function(...btns) {
            btns.forEach(btn => btn.style.display = 'inline-block');
        },
        getState: function() {
            return state;
        }
        
    }
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Dynamically choose what enter should do based on state
        document.addEventListener('keypress', function(e) {
            if (e.keycode === 13 || e.which === 13) {
                if (UICtrl.getState() === 'add') {
                    document.querySelector(UISelectors.addBtn).dispatchEvent(new Event('click'));
                } else if (UICtrl.getState() === 'edit') {
                    document.querySelector(UISelectors.updateBtn).dispatchEvent(new Event('click'));
                }

                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        // Back button click event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear input
            UICtrl.clearInput();
        }

        e.preventDefault();
    }


    // Click edit item
    const itemEditClick = function(e) {
        if (e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listIdArr = listId.split('-');

            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }


    // Update item submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        // Clear edit state
        UICtrl.clearEditState();

        e.preventDefault()
    }


    // Delete button event
    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Remove from localStorage
        StorageCtrl.removeItem(currentItem);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Clear edit state
        UICtrl.clearEditState();

        // Hide list if no items remaining
        if (ItemCtrl.getItems().length === 0) {
            UICtrl.hideList();
        }

        e.preventDefault();
    }


    // Clear items event
    const clearAllItemsClick = function() {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Clear items from localStorage
        StorageCtrl.clearItems();

        // Remove all items from UI
        UICtrl.removeItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Hide UL
        UICtrl.hideList();
    }


    return {
        init: function() {
            // Clear edit state / set initial state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);

                // Get total calories
                const totalCalories = ItemCtrl.getTotalCalories();

                // Add total calories to UI
                UICtrl.showTotalCalories(totalCalories);
            }

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// Intitialize App
App.init();