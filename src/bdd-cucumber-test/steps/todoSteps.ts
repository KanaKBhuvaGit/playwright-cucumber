import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { Page, expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import { TODO_ITEMS } from "../../../fixtures/ui/testdata";

setDefaultTimeout(60 * 1000 * 2)

Given('User navigates to the todo application', async function () {
    await fixture.page.goto(process.env.BASEURL_TODO);
    fixture.logger.info("Navigated to the todo application")
})

When('User add the task as {string}', async function (task) {
    const newTodo = await fixture.page.getByPlaceholder('What needs to be done?')
    await newTodo.fill(task);
    await newTodo.press('Enter');
})

Then('{string} should get added in the list', async function (task) {
    await expect(fixture.page.getByTestId('todo-title')).toHaveText([task]);
})

Then('The input text field should be cleared after adding the Task', async function(){
    const newTodo = fixture.page.getByPlaceholder('What needs to be done?');
    await expect(newTodo).toBeEmpty(); 
})

Then('Last item in the task list should be {string}', async function (task){
    await expect((await fixture.page.getByTestId('todo-title').last().textContent()).toString()).toEqual(task)
})

When('User added three default task', async function(){
    await createDefaultTodos(fixture.page);
})

When('User mark all items as completed', async function(){
    await fixture.page.getByLabel('Mark all as complete').check();
})

Then('Verify that all the items should be marked as completed', async function(){
    const toggleAll = fixture.page.getByLabel('Mark all as complete');
    await expect(toggleAll).toBeChecked();
    await expect(fixture.page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
})

When('User mark all items as incompleted', async function(){
    const toggleAll = fixture.page.getByLabel('Mark all as complete');
    await toggleAll.check();
    await toggleAll.uncheck();
})

Then('Verify that all the items should be marked as incompleted', async function(){
    const toggleAll = fixture.page.getByLabel('Mark all as complete');
    await expect(toggleAll).not.toBeChecked();
    await expect(fixture.page.getByTestId('todo-item')).toHaveClass(['', '', '']);
})

When('User mark first task as incomplete', async function(){
    const firstTodo = fixture.page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').uncheck();
})

When('User mark the first task as completed', async function(){
    const firstTodo = fixture.page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').check();
})

When('Verify that toggle arrow should be updated', async function(){
    const toggleAll = fixture.page.getByLabel('Mark all as complete');
    await expect(toggleAll).not.toBeChecked();
})

When('Verify that first item should be marked as completed', async function(){
    const firstTodoCheck = fixture.page.getByTestId('todo-item').nth(0).getByRole('checkbox');;
    await expect(firstTodoCheck).toBeChecked();
})

When('Verify that first item should be marked as incompleted', async function(){
    const firstTodoCheck = fixture.page.getByTestId('todo-item').nth(0).getByRole('checkbox');;
    await expect(firstTodoCheck).not.toBeChecked();
})

When('Edit the second task as {string}', async function(task){
    const todoItems = fixture.page.getByTestId('todo-item');
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();
    await expect(secondTodo.getByRole('textbox', { name: 'Edit' })).toHaveValue(TODO_ITEMS[1]);
    await secondTodo.getByRole('textbox', { name: 'Edit' }).fill(task);
    await secondTodo.getByRole('textbox', { name: 'Edit' }).press('Enter');
})

When('Verify that second task in the list should be {string}', async function(task){
    const todoItems = fixture.page.getByTestId('todo-item');
    const secondTodo = todoItems.nth(1);
    await expect(secondTodo).toBeVisible();
    expect((await secondTodo.textContent()).toString()).toEqual(task)
})

When('User click twice on the second task', async function(){
    const todoItem = fixture.page.getByTestId('todo-item').nth(1);
    await todoItem.dblclick();
})

Then('Verify that other controls of second task should be invisible to the user', async function(){
    const todoItem = fixture.page.getByTestId('todo-item').nth(1);
    await expect(todoItem.getByRole('checkbox')).not.toBeVisible();
    await expect(todoItem.locator('label', {
      hasText: TODO_ITEMS[1],
    })).not.toBeVisible();
})

When('User enter {string} and click outside the second task', async function(task){
    const todoItem = fixture.page.getByTestId('todo-item').nth(1);
    await todoItem.getByRole('textbox', { name: 'Edit' }).fill(task);
    await todoItem.getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');
})

When('User press escape key on the keyboard', async function(){
    const todoItem = fixture.page.getByTestId('todo-item').nth(1);
    await todoItem.getByRole('textbox', { name: 'Edit' }).press('Escape');
})

When('Count of the tasks should get updated to {int}', async function(count){
    const todoCount = fixture.page.getByTestId('todo-count')
    await (expect(todoCount)).toContainText(count.toString());
})

When('Tasks displayed on the page should be {int}', async function(count){
    const todoCount = fixture.page.getByTestId('todo-item')
    await expect(todoCount).toHaveCount(count);
})

Then('Verify that Clear completed link should be visible', async function(){
    await expect(fixture.page.getByRole('button', { name: 'Clear completed' })).toBeVisible();
})

Then('Verify that Clear completed link should be hidden', async function(){
    await expect(fixture.page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
})

When('User clicked on the Clear completed link', async function(){
    await fixture.page.getByRole('button', { name: 'Clear completed' }).click();
})

Then('Refresh the page', async function(){
    await fixture.page.reload();
})

When('User click on the Active link', async function(){
    await fixture.page.getByRole('link', { name: 'Active' }).click();
})

When('Active link should be selected', async function(){
    await fixture.page.getByRole('link', { name: 'Active' }).click();
})

When('User click on the Completed link', async function(){
    await fixture.page.getByRole('link', { name: 'Completed' }).click();
})

When('Completed link should be selected', async function(){
    await fixture.page.getByRole('link', { name: 'Completed' }).click();
})

When('User click on the All link', async function(){
    await fixture.page.getByRole('link', { name: 'All' }).click();
})

When('All link should be selected', async function(){
    await fixture.page.getByRole('link', { name: 'All' }).click();
})

When('User click on the back button of the page', async function(){
    await fixture.page.goBack();
})

async function createDefaultTodos(page: Page) {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    for (const item of TODO_ITEMS) {
        await newTodo.fill(item);
        await newTodo.press('Enter');
    }
}
