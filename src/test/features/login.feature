Feature: User Authentication tests

  Background: 
    Given User navigates to the login page
 
  Scenario: Login should be success
    And User enter the username as "student"
    And User enter the password as "Password123"
    When User click on the login button
    Then Login should be success and the message displayed on the page should be "Congratulations student. You successfully logged in!"

  Scenario: Login should not be success
    Given User enter the username as "incorrectUser"
    Given User enter the password as "Password123"
    When User click on the login button
    But Login should fail and the message displayed on the page should be "Your username is invalid!"

  Scenario: Login should not be success
    Given User enter the username as "student"
    Given User enter the password as "incorrectPassword"
    When User click on the login button
    But Login should fail and the message displayed on the page should be "Your password is invalid!"
