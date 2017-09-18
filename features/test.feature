@test tag
@one more tag
@and one more

Feature: test feature

    #comment 1
    Background: background_name
        Given Log in

    Scenario: test scenario 1
        Then logout

    #comment 2
    Scenario: test scenario 2
        Then sign out
        #Then test commented

    Scenario Outline:
        Then check <foo>
        Then index <i>

    Examples:
        |foo|  i| j|

        |bar|  1|  |
        #test comment in the middle of table
        |baz|  2| 0|
