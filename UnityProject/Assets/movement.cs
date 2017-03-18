using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class movement : MonoBehaviour 
{
	
	// Use this for initialization
	void Start () 
	{
		
	}
	
	// Update is called once per frame
	void Update () 
	{
		int speed=10;
		if(Input.GetKey(KeyCode.RightArrow))
		{
			transform.Translate(new Vector3(speed * Time.deltaTime,0,0));
		}
		if(Input.GetKey(KeyCode.LeftArrow))
		{
			Vector3 x = new Vector3 (-speed * Time.deltaTime, 0, 0);
			transform.Translate(x);
		}
		if(Input.GetKey(KeyCode.DownArrow))
		{
			transform.Translate(new Vector3(0,-speed * Time.deltaTime,0));
		}
		if(Input.GetKey(KeyCode.UpArrow))
		{
			Vector3 x = new Vector3 (0, speed * Time.deltaTime, 0);
			transform.Translate(x);
		}
		
	}
}
