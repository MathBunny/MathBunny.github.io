/*  CPT Meeting #1
    Solution for Fibonnaci Problem (Hard) */
import java.io.*;
import java.util.*;
import java.math.*;

class Main{
	public static void main (String [] args){new Main();}
	
	public int getDigits(BigInteger digits){
		BigInteger ten = new BigInteger("10");
		int count = 0;
		do {
			digits = digits.divide(ten);
			count++;
		} while (!digits.equals(BigInteger.ZERO));	
		return count;
	}
	
	public Main(){
		int digits = 100;
		int iterations = 0;
		BigInteger a = new BigInteger("1");
		BigInteger b = new BigInteger("2");
		BigInteger c;
		while(true){
			if (getDigits(a) >= digits){
				System.out.println("Iterations: " + (iterations+3));
				break;	
			}
			iterations++;
			c = a.add(b);
			b = a;
			a = c;
		}
			
	}
}