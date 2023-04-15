import { Locator, type Page } from '@playwright/test';
import { TODO_ITEMS } from '../../../fixtures/ui/testdata';

export class TodoPage {
    readonly todoTextbox: Locator;
    readonly todoTitlesList: Locator;
    readonly todoCounter: Locator;
    readonly toggleAll: Locator;
    readonly todoItems: Locator;
    readonly clearCompletedButton: Locator;
    readonly allLink: Locator;
    readonly activeLink: Locator;
    readonly completedLink: Locator;
    readonly getItemElement: Function;
    readonly getItemCheckBox: Function;

    constructor(page: Page) {
        this.todoTextbox = page.getByPlaceholder('What needs to be done?');
        this.todoTitlesList = page.getByTestId('todo-title');
        this.todoCounter = page.getByTestId('todo-count');
        this.toggleAll = page.getByLabel('Mark all as complete');
        this.todoItems = page.getByTestId('todo-item');
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
        this.allLink = page.locator('//a[contains(text(),"All")]');
        this.activeLink = page.getByRole('link', { name: 'Active' })
        this.completedLink = page.getByRole('link', { name: 'Completed' });
        this.getItemElement = (item: number) => { return this.todoItems.nth(item) }
        this.getItemCheckBox = (item: number) => { return this.getItemElement(item).getByRole('checkbox') } 
    }

    async addTodo(todo: string){
        const newTodo = this.todoTextbox;
        await newTodo.type(todo);
        await newTodo.press('Enter');
    }

    async markAllAsComplete(){
        this.toggleAll.check();
    }

    async markAllAsIncomplete(){
        this.toggleAll.uncheck();
    }

    async markItemAsComplete(item: number){
        return this.getItemCheckBox(item).check();
    }

    async markItemAsIncomplete(item: number){
        return this.getItemCheckBox(item).uncheck();
    }

    async doubleClickOnItem(todo: any){
        todo.dblclick(); 
    }

    async editTheTodoText(todo: any, newText: any){
        todo.fill(newText)
    }

    async pressKey(item: any, key: any){
        item.press(key)
    }

    async clickOnClearComplete(){
        this.clearCompletedButton.click();
    }

    async clickOnCompletedLink(){
        this.completedLink.click();
    }

    async clickOnAllLink(){
        this.allLink.click();
    }

    async clickOnActiveLink(){
        this.activeLink.click();
    }

    async createDefaultTodos() {
        const newTodo = this.todoTextbox;
    
        for (const item of TODO_ITEMS) {
            await newTodo.fill(item);
            await newTodo.press('Enter');
        }
    }
}

