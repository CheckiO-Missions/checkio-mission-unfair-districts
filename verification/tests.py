"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""
from random import randint, shuffle

s_a, s_b = list(range(1, 10)), list(range(9))
shuffle(s_a)
zz = list(zip(s_a, s_b))
extra_1 = list([zz[i: i+3] for i in range(0, len(zz), 3)])


TESTS = {
    "Basics": [
        {
            "input": [5, [
                [[2, 1], [1, 1], [1, 2]],
                [[2, 1], [1, 1], [0, 2]]],
            ],
            "answer": [5, [
                [[2, 1], [1, 1], [1, 2]],
                [[2, 1], [1, 1], [0, 2]]],
            ],
            "explanation": '3x2',
        },
        {
            "input": [9, [
                [[0, 3], [3, 3], [1, 1]],
                [[1, 2], [1, 0], [1, 1]],
                [[0, 3], [2, 1], [2, 2]]],
            ],
            "answer": [9, [
                [[0, 3], [3, 3], [1, 1]],
                [[1, 2], [1, 0], [1, 1]],
                [[0, 3], [2, 1], [2, 2]]],
            ],
            "explanation": [
                "3x3",
            ],
        },
        {
            "input": [8, [
                [[1, 1], [2, 0], [2, 0], [3, 3]],
                [[1, 1], [1, 2], [1, 1], [0, 3]],
                [[1, 1], [1, 1], [1, 2], [0, 3]],
                [[1, 1], [1, 1], [1, 1], [2, 0]]]
            ],
            "answer": [8, [
                [[1, 1], [2, 0], [2, 0], [3, 3]],
                [[1, 1], [1, 2], [1, 1], [0, 3]],
                [[1, 1], [1, 1], [1, 2], [0, 3]],
                [[1, 1], [1, 1], [1, 1], [2, 0]]]
            ],
            "explanation": [
                "4x4",
            ],
        }
    ]
}
