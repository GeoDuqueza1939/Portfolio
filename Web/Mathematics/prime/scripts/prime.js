function isPrime(i)
{
    var prime = true;
    var n = 3;

    prime = !(i < 2 || (i != 2 && i % 2 == 0));

    while (prime && n * n <= i) {
        if (i % n == 0) prime = false;
        n += 2;
    }

    return prime;
}

