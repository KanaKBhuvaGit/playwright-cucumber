Feature: Toto tests

  Background: 
    Given User navigates to the todo application

  Scenario Outline: New Todo - should allow me to add todo items
    When User add the task as "<task>"
    Then "<task>" should get added in the list
    Examples: 
      | task                       |
      | buy some cheese            | 
      | feed the cat               | 
      | book a doctors appointment |

  Scenario: New Todo - should clear text input field when an item is added
    When User add the task as "buy some cheese"
    Then The input text field should be cleared after adding the Task

  Scenario: New Todo - should append new items to the bottom of the list
    When User add the task as "buy some cheese"
    And User add the task as "feed the cat"
    Then Last item in the task list should be "feed the cat"

  Scenario: Mark all as completed - should allow me to mark all items as completed
    When User added three default task
    And User mark all items as completed
    Then Verify that all the items should be marked as completed 

  Scenario: Mark all as completed - should allow me to clear the complete state of all items
    When User added three default task
    And User mark all items as incompleted
    Then Verify that all the items should be marked as incompleted
  
  Scenario: Mark all as completed - complete all checkbox should update state when items are completed / cleared
    When User added three default task
    And User mark all items as completed
    Then Verify that all the items should be marked as completed
    And User mark first task as incomplete
    Then Verify that toggle arrow should be updated
    And User mark the first task as completed
    Then Verify that all the items should be marked as completed
  
  Scenario: Item - should allow me to mark items as complete
    When User added three default task
    And User mark the first task as completed
    Then Verify that first item should be marked as completed

  Scenario: Item - should allow me to un-mark items as complete
    When User added three default task
    And User mark first task as incomplete
    Then Verify that first item should be marked as incompleted
 
  Scenario: Item - should allow me to edit an item
    When User added three default task
    And Edit the second task as "buy some sausages"
    Then Verify that second task in the list should be "buy some sausages"

  Scenario: Editing - should hide other controls when editing
    When User added three default task
    And User click twice on the second task
    Then Verify that other controls of second task should be invisible to the user

  Scenario: Editing - should save edits on blur
    When User added three default task
    And User click twice on the second task
    And User enter "buy some sausages" and click outside the second task
    Then Verify that second task in the list should be "buy some sausages"

  Scenario: Editing - should trim entered text
    When User added three default task  
    And User click twice on the second task
    And User enter "     buy some sausages              " and click outside the second task
    Then Verify that second task in the list should be "buy some sausages"

  Scenario: Editing - should remove the item if an empty text string was entered
    When User added three default task
    And User click twice on the second task
    And User enter "" and click outside the second task
    Then Verify that second task in the list should be "book a doctors appointment"

  Scenario: Editing - should cancel edits on escape
    When User added three default task
    And User click twice on the second task
    And User press escape key on the keyboard
    Then Verify that second task in the list should be "feed the cat"

  Scenario: Counter - should display the current number of todo items
    When User add the task as "buy some cheese"
    Then Count of the tasks should get updated to 1
    When User add the task as "feed the cat"
    Then Count of the tasks should get updated to 2
    When User add the task as "book a doctors appointment"
    Then Count of the tasks should get updated to 3

  Scenario: Clear completed button - should display the correct text
    When User added three default task
    And User mark the first task as completed
    Then Verify that Clear completed link should be visible

  Scenario: Clear completed button - should remove completed items when clicked
    When User added three default task
    And User mark the first task as completed
    And User clicked on the Clear completed link
    Then Tasks displayed on the page should be 2

  Scenario: Clear completed button - should be hidden when there are no items that are completed
    When User added three default task
    And User mark the first task as completed
    And User clicked on the Clear completed link
    Then Verify that Clear completed link should be hidden

  Scenario: Persistence - should persist its data
    When User add the task as "buy some cheese"
    And User add the task as "feed the cat"
    And User mark the first task as completed
    Then Verify that first item should be marked as completed
    And Refresh the page
    And Verify that first item should be marked as completed
    
  Scenario: Routing - should allow me to display active items
    When User added three default task
    And User mark the first task as completed
    And User click on the Active link
    Then Tasks displayed on the page should be 2

  Scenario: Routing - should respect the back button
    When User added three default task
    And User mark the first task as completed
    And User click on the All link
    Then Tasks displayed on the page should be 3
    And User click on the Active link
    And User click on the Completed link
    Then Tasks displayed on the page should be 1
    And User click on the back button of the page
    Then Tasks displayed on the page should be 2
    And User click on the back button of the page
    Then Tasks displayed on the page should be 3
  
  Scenario: Routing - should allow me to display completed items
    When User added three default task
    And User mark the first task as completed
    And User click on the Completed link
    And Tasks displayed on the page should be 1

  Scenario: Routing - should allow me to display all items
    When User added three default task
    And User mark the first task as completed
    And User click on the Active link
    And User click on the Completed link
    And User click on the All link
    Then Tasks displayed on the page should be 3

  Scenario: Routing - should highlight the currently applied filter
    When User added three default task
    Then All link should be selected
    When User click on the Active link
    Then Active link should be selected
    And User click on the Completed link
    Then Completed link should be selected

