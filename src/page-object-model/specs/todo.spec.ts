import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todoPage'; 
import { TODO_ITEMS, TODO_ITEM_EDIT } from '../../../fixtures/ui/testdata';
import { LocalStorage } from '../../../util/localStorage';

let todoPageObject: TodoPage;
let localStorage: LocalStorage;
const ENDPOINT = "todomvc"

test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/${ENDPOINT}`);
    todoPageObject = new TodoPage(page);
    localStorage = new LocalStorage();
});

test.describe('New Todo', () => {
    test('should allow me to add todo items', async ({ page }) => {
      await todoPageObject.addTodo(TODO_ITEMS[0]);
      await expect(page.getByTestId('todo-title')).toHaveText([
        TODO_ITEMS[0]
      ]);
  
      await todoPageObject.addTodo(TODO_ITEMS[1]);
      await expect(page.getByTestId('todo-title')).toHaveText([
        TODO_ITEMS[0],
        TODO_ITEMS[1]
      ]);
  
      await localStorage.checkNumberOfTodosInLocalStorage(page, 2);
    });
  
    test('should clear text input field when an item is added', async ({ page }) => {
        await todoPageObject.addTodo(TODO_ITEMS[0]);
        await expect(await todoPageObject.todoTextbox).toBeEmpty();
        
        await localStorage.checkNumberOfTodosInLocalStorage(page, 1);
    });
  
    test('should append new items to the bottom of the list', async ({ page }) => {
      await todoPageObject.createDefaultTodos();
  
      const todoCount = await todoPageObject.todoCounter;
      const todoTitles = await todoPageObject.todoTitlesList;
    
      await expect(page.getByText('3 items left')).toBeVisible();
      await expect(todoCount).toHaveText('3 items left');
      await expect(todoCount).toContainText('3');
      await expect(todoCount).toHaveText(/3/);
  
      await expect(todoTitles).toHaveText(TODO_ITEMS);

      await localStorage.checkNumberOfTodosInLocalStorage(page, 3);
    });
  });
  
  test.describe('Mark all as completed', () => {
    test.beforeEach(async ({ page }) => {
      await todoPageObject.createDefaultTodos();
      await localStorage.checkNumberOfTodosInLocalStorage(page, 3);
    });
  
    test.afterEach(async ({ page }) => {
      await localStorage.checkNumberOfTodosInLocalStorage(page, 3);
    });
  
    test('should allow me to mark all items as completed', async ({ page }) => {
      await todoPageObject.markAllAsComplete();
      await expect(await todoPageObject.todoItems).toHaveClass(['completed', 'completed', 'completed']);
  
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 3);
    });
  
    test('should allow me to clear the complete state of all items', async ({ page }) => {
      // await todoPageObject.markAllAsComplete();
      await todoPageObject.markAllAsIncomplete();
      await expect(await todoPageObject.todoItems).toHaveClass(['', '', '']);
    });
  
    test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
      await todoPageObject.markAllAsComplete();
      await expect(await todoPageObject.toggleAll).toBeChecked();

      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 3);
  
      await todoPageObject.markItemAsIncomplete(0);
      await expect(await todoPageObject.toggleAll).not.toBeChecked();
  
      await todoPageObject.markItemAsComplete(0);
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 3);
  
      await expect(await todoPageObject.toggleAll).toBeChecked();
    });
  });
  
  test.describe('Item', () => {
  
    test('should allow me to mark items as complete', async ({ page }) => {
      await todoPageObject.addTodo(TODO_ITEMS[0]);
      await todoPageObject.addTodo(TODO_ITEMS[1]);
      
      await todoPageObject.markItemAsComplete(0);
      await expect(await todoPageObject.getItemElement(0)).toHaveClass('completed');
  
      await todoPageObject.markItemAsComplete(1);
      await expect(await todoPageObject.getItemElement(1)).toHaveClass('completed');
  
      await expect(await todoPageObject.getItemElement(0)).toHaveClass('completed');
      await expect(await todoPageObject.getItemElement(1)).toHaveClass('completed');
    });
  
    test('should allow me to un-mark items as complete', async ({ page }) => {
      await todoPageObject.addTodo(TODO_ITEMS[0]);
      await todoPageObject.addTodo(TODO_ITEMS[1]);

      await todoPageObject.markItemAsComplete(0);
      await expect(await todoPageObject.getItemElement(0)).toHaveClass('completed');
      await expect(await todoPageObject.getItemElement(1)).not.toHaveClass('completed');
  
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 1);
  
      await todoPageObject.markItemAsIncomplete(0);
      await expect(await todoPageObject.getItemElement(0)).not.toHaveClass('completed');
      await expect(await todoPageObject.getItemElement(1)).not.toHaveClass('completed');
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 0);
    });
  
    test('should allow me to edit an item', async ({ page }) => {
      await todoPageObject.createDefaultTodos();
  
      const secondTodo = await todoPageObject.getItemElement(1)
      const secondTodoEditBox = secondTodo.getByRole('textbox', { name: 'Edit' });
      await todoPageObject.doubleClickOnItem(secondTodo);
      await expect(secondTodoEditBox).toHaveValue(TODO_ITEMS[1]);
      // await todoPageObject.editTheTodoText(secondTodoEditBox, TODO_ITEM_EDIT);
      await secondTodoEditBox.fill(TODO_ITEM_EDIT);
      await secondTodoEditBox.press('Enter');
      
      await expect(await todoPageObject.todoItems).toHaveText([
        TODO_ITEMS[0],
        TODO_ITEM_EDIT,
        TODO_ITEMS[2]
      ]);

      await localStorage.checkTodosInLocalStorage(page, TODO_ITEM_EDIT);
    });
  });
  
  test.describe('Editing', () => {
    test.beforeEach(async ({ page }) => {
      await todoPageObject.createDefaultTodos();
      await localStorage.checkNumberOfTodosInLocalStorage(page, 3);
    });
  
    test('should hide other controls when editing', async ({ page }) => {
      
      const secondTodo = await todoPageObject.getItemElement(1)
      await todoPageObject.doubleClickOnItem(secondTodo);
      await expect(secondTodo.getByRole('checkbox')).not.toBeVisible();
      await expect(secondTodo.locator('label', {
        hasText: TODO_ITEMS[1],
      })).not.toBeVisible();

      await localStorage.checkNumberOfTodosInLocalStorage(page, 3);
    });
  
    test('should save edits on blur', async ({ page }) => {
      
      const secondTodo = await todoPageObject.getItemElement(1);
      const secondTodoEditBox = secondTodo.getByRole('textbox', { name: 'Edit' });
      await todoPageObject.doubleClickOnItem(secondTodo);
      await secondTodoEditBox.fill(TODO_ITEM_EDIT);
      await secondTodoEditBox.dispatchEvent('blur');
  
      await expect(await todoPageObject.todoItems).toHaveText([
        TODO_ITEMS[0],
        TODO_ITEM_EDIT,
        TODO_ITEMS[2],
      ]);

      await localStorage.checkTodosInLocalStorage(page, TODO_ITEM_EDIT);
    });
  
    test('should trim entered text', async ({ page }) => {
      const secondTodo = await todoPageObject.getItemElement(1);
      const secondTodoEditBox = secondTodo.getByRole('textbox', { name: 'Edit' });
      await todoPageObject.doubleClickOnItem(secondTodo);
      await secondTodoEditBox.fill('    buy some sausages    ');
      await secondTodoEditBox.press('Enter');
  
      await expect(await todoPageObject.todoItems).toHaveText([
        TODO_ITEMS[0],
        TODO_ITEM_EDIT,
        TODO_ITEMS[2],
      ]);

      await localStorage.checkTodosInLocalStorage(page, TODO_ITEM_EDIT);
    });
  
    test('should remove the item if an empty text string was entered', async ({ page }) => {
      const secondTodo = await todoPageObject.getItemElement(1);
      const secondTodoEditBox = secondTodo.getByRole('textbox', { name: 'Edit' });
      await todoPageObject.doubleClickOnItem(secondTodo);
      await secondTodoEditBox.fill('');
      await secondTodoEditBox.press('Enter');
  
      await expect(await todoPageObject.todoItems).toHaveText([
        TODO_ITEMS[0],
        TODO_ITEMS[2],
      ]);
    });
  
    test('should cancel edits on escape', async ({ page }) => {
      const secondTodo = await todoPageObject.getItemElement(1);
      const secondTodoEditBox = secondTodo.getByRole('textbox', { name: 'Edit' });
      await todoPageObject.doubleClickOnItem(secondTodo);
      await secondTodoEditBox.fill(TODO_ITEM_EDIT);
      await secondTodoEditBox.press('Escape');
      await expect(await todoPageObject.todoItems).toHaveText(TODO_ITEMS);
    });
  });
  
  test.describe('Counter', () => {
    test('should display the current number of todo items', async ({ page }) => {
      // create a new todo locator
      await todoPageObject.addTodo(TODO_ITEMS[0])
      await expect(await todoPageObject.todoCounter).toContainText('1');
  
      await todoPageObject.addTodo(TODO_ITEMS[1])
      await expect(await todoPageObject.todoCounter).toContainText('2');
  
      await localStorage.checkNumberOfTodosInLocalStorage(page, 2);
    });
  });
  
  test.describe('Clear completed button', () => {
    test.beforeEach(async ({ page }) => {
      await todoPageObject.createDefaultTodos();
    });
  
    test('should display the correct text', async ({ page }) => {
      await todoPageObject.markItemAsComplete(0);
      await expect(todoPageObject.clearCompletedButton).toBeVisible();
    });
  
    test('should remove completed items when clicked', async ({ page }) => {
      await todoPageObject.markItemAsComplete(1);
      await todoPageObject.clickOnClearComplete();
      await expect(todoPageObject.todoItems).toHaveCount(2);
      await expect(todoPageObject.todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    });
  
    test('should be hidden when there are no items that are completed', async ({ page }) => {
      await todoPageObject.markItemAsComplete(0);
      await todoPageObject.clickOnClearComplete();
      await expect(todoPageObject.clearCompletedButton).toBeHidden();
    });
  });
  
  test.describe('Persistence', () => {
    test('should persist its data', async ({ page }) => {
      await todoPageObject.addTodo(TODO_ITEMS[0]);
      await todoPageObject.addTodo(TODO_ITEMS[1]);
      
      await todoPageObject.markItemAsComplete(0)
      await expect(todoPageObject.todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
      await expect(todoPageObject.getItemCheckBox(0)).toBeChecked();
      await expect(todoPageObject.todoItems).toHaveClass(['completed', '']);
  
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 1);
  
      await page.reload();
      await expect(todoPageObject.todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
      await expect(todoPageObject.getItemCheckBox(0)).toBeChecked();
      await expect(todoPageObject.todoItems).toHaveClass(['completed', '']);
    });
  });
  
  test.describe('Routing', () => {
    test.beforeEach(async ({ page }) => {
      await todoPageObject.createDefaultTodos();
      await localStorage.checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    });
  
    test('should allow me to display active items', async ({ page }) => {
      await todoPageObject.markItemAsComplete(1)
      
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 1);

      await todoPageObject.clickOnActiveLink();
      await expect(todoPageObject.todoItems).toHaveCount(2);
      await expect(todoPageObject.todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    });
  
    test.only('should respect the back button', async ({ page }) => {
      await todoPageObject.markItemAsComplete(1)
      
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 1);
      
      await todoPageObject.clickOnAllLink();
      await expect(todoPageObject.todoItems).toHaveCount(3);
      await todoPageObject.clickOnActiveLink();
      await todoPageObject.clickOnCompletedLink();
  
      await expect(todoPageObject.todoItems).toHaveCount(1);
      await page.goBack();
      await expect(todoPageObject.todoItems).toHaveCount(3);
      await page.goBack();
      await expect(todoPageObject.todoItems).toHaveCount(0);
    });
  
    test('should allow me to display completed items', async ({ page }) => {
      await todoPageObject.markItemAsComplete(1)
      
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 1);
      
      await todoPageObject.clickOnCompletedLink();
      await expect(todoPageObject.todoItems).toHaveCount(1);
    });
  
    test('should allow me to display all items', async ({ page }) => {
      await todoPageObject.markItemAsComplete(1)
      
      await localStorage.checkNumberOfCompletedTodosInLocalStorage(page, 1);
      
      // await todoPageObject.clickOnCompletedLink();
      // await todoPageObject.clickOnActiveLink();
      await todoPageObject.clickOnAllLink();

      await expect(todoPageObject.todoItems).toHaveCount(3);
    });
  
    test('should highlight the currently applied filter', async ({ page }) => {
      await expect(todoPageObject.allLink).toHaveClass('selected');
      
      await todoPageObject.clickOnActiveLink();
      await expect(todoPageObject.activeLink).toHaveClass('selected');
      await todoPageObject.clickOnCompletedLink();
  
      await expect(todoPageObject.completedLink).toHaveClass('selected');
    });
  });
