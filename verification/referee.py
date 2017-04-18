"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"

checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.

checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.

"""

from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
from itertools import chain

from tests import TESTS

def checker(input, user_result):

    if not input and not user_result:
        return True, (user_result, '')

    area_of_district, grid = input[0], input[1]
    w, h = len(grid[0]), len(grid)
    size = w * h
    cell_dic = {}

    # make cell_dic
    def adj_cells(cell):
        result = []
        if cell % w != 1 and cell - 1 > 0:
            result.append(cell - 1)
        if cell % w and cell + 1 <= size:
            result.append(cell + 1)
        if (cell - 1) // w:
            result.append(cell - w)
        if (cell - 1) // w < h - 1:
            result.append(cell + w)
        return set(result)

    for i, v in enumerate(chain(*grid)):
        cell_dic[i + 1] = {'vote': v, 'adj': adj_cells(i + 1)}

    answer = user_result

    # answer check
    def district_check(d):
        all_cells = set(d[1:])
        next_cells = cell_dic[d[0]]['adj']
        for _ in range(area_of_district - 1):
            all_cells -= next_cells
            next_cells = set(chain(*[list(cell_dic[nc]['adj'])
                for nc in next_cells])) & set(d)
        return not all_cells

    if not isinstance(answer, list):
        return False, (user_result, 'wrong data type')
    else:
        for an in answer:
            if not isinstance(an, list):
                return False, (user_result, 'wrong data type')
            elif not an or not all(isinstance(a, int) for a in an):
                return False, (user_result, 'wrong data type')
            elif not district_check(an):
                return False, (user_result, 'wrong district')
        if set(range(1, size+1)) ^ set(chain(*answer)):
            return False, (user_result, 'not exists all cells')

    # win check
    win, lose = 0, 0
    for part in answer:
        vote_a, vote_b = 0, 0
        for p in part:
            a, b = cell_dic[p]['vote']
            vote_a += a
            vote_b += b
        win += vote_a > vote_b
        lose += vote_a < vote_b

    return win > lose, (user_result, '')

api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        function_name={
            "python": "unfair_districts",
            "js": "unfairDistricts"
        },
        checker=checker,
        cover_code={
            'python-3': cover_codes.unwrap_args,
            'js-node': cover_codes.js_unwrap_args
        }
    ).on_ready)
